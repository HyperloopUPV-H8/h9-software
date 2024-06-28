package session

import (
	"fmt"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/rs/zerolog"
)

const defaultBufferSize = 4096

// conversationCallback is called when a new conversation is detected, the conversation socket,
// as well as the reader to get its packets, is provided through this callback.
type conversationCallback = func(socket network.Socket, reader io.Reader)

// packetReader is a reader that generates packets from network connections
type packetReader interface {
	ReadNext() (network.Payload, error)
}

// Sniffer demux is a helper that takes all packets returned by the Sniffer and splits their
// contents onto buffers based on the source and destination IPs and ports
type SnifferDemux struct {
	conversations map[network.Socket]io.Writer

	onConversation conversationCallback
	errorChan      chan<- error

	logger zerolog.Logger
}

// NewSnifferDemux creates a new SnifferDemux with the provided onConversation callback
func NewSnifferDemux(onConversation conversationCallback, baseLogger zerolog.Logger) (*SnifferDemux, <-chan error) {
	logger := baseLogger.Sample(zerolog.LevelSampler{
		TraceSampler: zerolog.RandomSampler(25000),
		DebugSampler: zerolog.RandomSampler(1),
		InfoSampler:  zerolog.RandomSampler(1),
		WarnSampler:  zerolog.RandomSampler(1),
		ErrorSampler: zerolog.RandomSampler(1),
	})

	errorChan := make(chan error)

	return &SnifferDemux{
		conversations: make(map[network.Socket]io.Writer),

		onConversation: onConversation,
		errorChan:      errorChan,

		logger: logger,
	}, errorChan
}

// ReadPackets consumes the provided PacketReader.
//
// ReadPackets will block until an error is returned, callers are advised to run this
// in a goroutine.
func (demux *SnifferDemux) ReadPackets(reader packetReader) {
	for {
		payload, err := reader.ReadNext()
		if err != nil {
			if _, ok := err.(sniffer.ErrMissingLayers); ok {
				continue
			}
			demux.logger.Error().Stack().Err(err).Msg("read next")
			demux.errorChan <- err
			return
		}
		payloadLogger := demux.logger.With().Str(
			"from", fmt.Sprintf("%s:%d", payload.Socket.SrcIP, payload.Socket.SrcPort),
		).Str(
			"to", fmt.Sprintf("%s:%d", payload.Socket.DstIP, payload.Socket.DstPort),
		).Logger()

		payloadLogger.Trace().Time("capture", payload.Timestamp).Msg("read next")

		conversation, ok := demux.conversations[payload.Socket]
		if !ok {
			payloadLogger.Debug().Int("buffer size", defaultBufferSize).Msg("new conversation")
			buffer := NewBuffer(defaultBufferSize)
			demux.conversations[payload.Socket] = buffer
			conversation = buffer
			demux.onConversation(payload.Socket, buffer)
		}

		_, err = conversation.Write(payload.Data)
		if err != nil {
			payloadLogger.Error().Stack().Err(err).Msg("write")
			delete(demux.conversations, payload.Socket)
			demux.errorChan <- err
			continue
		}
	}
}

package vehicle

import (
	"errors"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/boards"
	"os"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	blcu_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	connection_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/connection"
	data_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/data"
	logger_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/logger"
	message_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/message"
	order_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	data_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	order_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	protection_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/protection"
	state_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/state"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	blcu_packet "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/state"
)

// Vehicle is the main abstraction that coordinates the backend modules.
// It receives its modules and once it is ready, the vehicle manages the flow of
// information between them, converting events generated by one module to the specific
// input for another one.
type Vehicle struct {
	broker        abstraction.Broker
	boards        map[abstraction.BoardId]abstraction.Board
	transport     abstraction.Transport
	logger        abstraction.Logger
	updateFactory *update_factory.UpdateFactory
	idToBoardName map[uint16]string
	ipToBoardId   map[string]abstraction.BoardId
}

// Notification is the method invoked by transport to notify of a new event (e.g.packet received)
func (vehicle *Vehicle) Notification(notification abstraction.TransportNotification) {
	packet := notification.(transport.PacketNotification)

	switch p := packet.Packet.(type) {
	case *data.Packet:
		update := vehicle.updateFactory.NewUpdate(p)
		err := vehicle.broker.Push(data_topic.NewPush(&update))
		if err != nil {
			fmt.Println(err)
		}

		err = vehicle.logger.PushRecord(&data_logger.Record{
			Packet:    p,
			From:      packet.From,
			To:        packet.To,
			Timestamp: packet.Timestamp,
		})

		if err != nil && !errors.Is(err, logger.ErrLoggerNotRunning{}) {
			fmt.Println("Error pushing record to data logger: ", err)
		}

	case *protection.Packet:
		boardId := vehicle.ipToBoardId[strings.Split(packet.From, ":")[0]]
		err := vehicle.broker.Push(message_topic.Push(p, boardId))
		if err != nil {
			fmt.Println(err)
		}

		err = vehicle.logger.PushRecord(&protection_logger.Record{
			Packet:    p,
			BoardId:   boardId,
			From:      packet.From,
			To:        packet.To,
			Timestamp: packet.Timestamp,
		})

		if err != nil && !errors.Is(err, logger.ErrLoggerNotRunning{}) {
			fmt.Println("Error pushing record to info logger: ", err)
		}

	case *state.Space:
		err := vehicle.logger.PushRecord(&state_logger.Record{
			Packet:    p,
			From:      packet.From,
			To:        packet.To,
			Timestamp: packet.Timestamp,
		})

		if err != nil && !errors.Is(err, logger.ErrLoggerNotRunning{}) {
			fmt.Println("Error pushing record to state logger: ", err)
		}

	case *order.Add:
		fmt.Fprintln(os.Stderr, "Received order.Add packet, ignoring")
	case *order.Remove:
		fmt.Fprintln(os.Stderr, "Received order.Remove packet, ignoring")

	case *blcu_packet.Ack:
		vehicle.boards[boards.BoardId].Notify(abstraction.BoardNotification(
			&boards.AckNotification{
				ID: boards.AckId,
			},
		))
	}
}

// UserPush is the method invoked by boards to signal the user has sent information to the back
func (vehicle *Vehicle) UserPush(push abstraction.BrokerPush) {
	switch push.Topic() {
	case order_topic.SendName:
		order, ok := push.(*order_topic.Order)
		if !ok {
			fmt.Fprintf(os.Stderr, "error casting push to order: %v\n", push)
			return
		}

		packet, err := order.ToPacket()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error converting order to packet: %v\n", err)
			return
		}

		err = vehicle.transport.SendMessage(transport.NewPacketMessage(packet))
		if err != nil {
			fmt.Fprintf(os.Stderr, "error sending packet: %v\n", err)
			return
		}

		err = vehicle.logger.PushRecord(&order_logger.Record{
			Packet:    packet,
			From:      "backend",
			To:        vehicle.idToBoardName[uint16(packet.Id())],
			Timestamp: packet.Timestamp(),
		})

		if err != nil && !errors.Is(err, logger.ErrLoggerNotRunning{}) {
			fmt.Fprintln(os.Stderr, "Error pushing record to logger: ", err)
		}
	case logger_topic.EnableName:
		status, ok := push.(*logger_topic.Status)
		if !ok {
			fmt.Fprintf(os.Stderr, "error casting push to logger status: %v\n", push)
			return
		}

		var err error
		if status.Enable() {
			err = vehicle.logger.Start()
		} else {
			err = vehicle.logger.Stop()
		}

		if err != nil {
			status.Fulfill(!status.Enable())
		} else {
			status.Fulfill(status.Enable())
		}

	case blcu_topic.DownloadName:
		vehicle.boards[boards.BoardId].Notify(abstraction.BoardNotification(
			&boards.DownloadEvent{
				EventID: boards.AckId,
				BoardID: boards.BoardId,
			},
		))

	case blcu_topic.UploadName:
		vehicle.boards[boards.BoardId].Notify(abstraction.BoardNotification(
			&boards.UploadEvent{
				EventID: boards.AckId,
				BoardID: boards.BoardId,
			},
		))

	default:
		fmt.Printf("unknow topic %s\n", push.Topic())
	}
}

// Request is the method invoked by a board to ask for a resource from the frontend
func (vehicle *Vehicle) Request(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return vehicle.broker.Pull(request)
}

// SendMessage is the method invoked by a board to send a message
func (vehicle *Vehicle) SendMessage(msg abstraction.TransportMessage) error {
	err := vehicle.transport.SendMessage(msg)
	return err
}

// SendPush is the method invoked by a board to send a message to the frontend
func (vehicle *Vehicle) SendPush(push abstraction.BrokerPush) error {
	return vehicle.broker.Push(push)
}

// ConnectionUpdate is the method invoked by transport to signal a connection state has changed
func (vehicle *Vehicle) ConnectionUpdate(target abstraction.TransportTarget, isConnected bool) {
	vehicle.broker.Push(connection_topic.NewConnection(string(target), isConnected))
	if isConnected {
		vehicle.updateFactory.ClearPacketsFor(target)
	}
}

package logger

import (
	"os"
	"path"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/rs/zerolog"
)

const (
	Name        = "loggerHandler"
	HandlerName = "logger"
)

// Logger is a struct that implements the abstraction.Logger interface
type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running        *atomic.Bool
	subloggersLock *sync.RWMutex
	// The subloggers are only the logger s selected at the start of the log
	subloggers map[abstraction.LoggerName]abstraction.Logger

	trace zerolog.Logger
}

var _ abstraction.Logger = &Logger{}

var Timestamp = time.Now()

func (Logger) HandlerName() string { return HandlerName }

func NewLogger(keys map[abstraction.LoggerName]abstraction.Logger, baseLogger zerolog.Logger) *Logger {
	trace := baseLogger.Sample(zerolog.LevelSampler{
		TraceSampler: zerolog.RandomSampler(25000),
		DebugSampler: zerolog.RandomSampler(1),
		InfoSampler:  zerolog.RandomSampler(1),
		WarnSampler:  zerolog.RandomSampler(1),
		ErrorSampler: zerolog.RandomSampler(1),
	})

	logger := &Logger{
		running:        &atomic.Bool{},
		subloggersLock: &sync.RWMutex{},
		subloggers:     keys,

		trace: trace,
	}

	logger.running.Store(false)
	return logger
}

func (logger *Logger) Start() error {
	logger.trace.Info().Msg("starting...")
	if !logger.running.CompareAndSwap(false, true) {
		logger.trace.Warn().Msg("already running")
		return nil
	}

	// Create log folders
	for subLogger := range logger.subloggers {
		loggerPath := path.Join("logger", string(subLogger), Timestamp.Format(time.RFC3339))
		logger.trace.Debug().Str("subLogger", string(subLogger)).Str("path", loggerPath).Msg("creating folder")
		err := os.MkdirAll(loggerPath, os.ModePerm)
		if err != nil {
			logger.trace.Error().Stack().Err(err).Msg("creating folder")
			return ErrCreatingAllDir{
				Name:      Name,
				Timestamp: time.Now(),
				Path:      loggerPath,
			}
		}
	}

	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	for name, sublogger := range logger.subloggers {
		err := sublogger.Start()
		if err != nil {
			logger.trace.Error().Stack().Err(err).Str("subLogger", string(name)).Msg("start sublogger")
			return err
		}
	}

	logger.trace.Info().Msg("started")
	return nil
}

// PushRecord works as a proxy for the PushRecord method of the subloggers
func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	logger.trace.Trace().Type("record", record).Msg("push")
	sublogger, ok := logger.subloggers[record.Name()]
	if !ok {
		logger.trace.Warn().Type("record", record).Str("name", string(record.Name())).Msg("no sublogger found for record")
		return ErrLoggerNotFound{record.Name()}
	}

	return sublogger.PushRecord(record)
}

// PullRecord works as a proxy for the PullRecord method of the subloggers
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	logger.trace.Trace().Type("request", request).Msg("request")
	loggerChecked, ok := logger.subloggers[request.Name()]
	if !ok {
		logger.trace.Warn().Type("request", request).Str("name", string(request.Name())).Msg("no subloggger found for request")
		return nil, ErrLoggerNotFound{request.Name()}
	}
	return loggerChecked.PullRecord(request)
}

func (logger *Logger) Stop() error {
	logger.trace.Info().Msg("stopping...")
	if !logger.running.CompareAndSwap(true, false) {
		logger.trace.Warn().Msg("already stopped")
		return nil
	}

	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	// The wait group is used in order to wait for all the subloggers to stop
	// before closing the main logger
	var wg sync.WaitGroup
	for name := range logger.subloggers {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			_ = sublogger.Stop()
		}(logger.subloggers[name])
	}
	wg.Wait()

	logger.trace.Info().Msg("stopped")
	return nil
}

package logger

import (
	"fmt"
	"os"
	"path"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
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
	// The subloggers are only the loggers selected at the start of the log
	subloggers map[abstraction.LoggerName]abstraction.Logger
}

var _ abstraction.Logger = &Logger{}

var Timestamp = time.Now()

func (Logger) HandlerName() string { return HandlerName }

func NewLogger(keys map[abstraction.LoggerName]abstraction.Logger) *Logger {
	logger := &Logger{
		running:        &atomic.Bool{},
		subloggersLock: &sync.RWMutex{},
		subloggers:     keys,
	}

	logger.running.Store(false)
	return logger
}

func (logger *Logger) Start() error {
	if !logger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}

	// Create log folders
	for logger := range logger.subloggers {
		loggerPath := path.Join(
			"logger",
			fmt.Sprint(logger),
			fmt.Sprintf("%s_%s", logger, Timestamp.Format(time.RFC3339)),
		)
		err := os.MkdirAll(loggerPath, os.ModePerm)
		if err != nil {
			return ErrCreatingAllDir{
				Name:      Name,
				Timestamp: time.Now(),
				Path:      loggerPath,
			}
		}
	}

	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	for _, key := range logger.subloggers {
		err := key.Start()
		if err != nil {
			fmt.Println(ErrStartingLogger{
				Name:      Name,
				Timestamp: time.Now(),
			}.Error())
		}
	}

	fmt.Println("Logger started")
	return nil
}

// PushRecord works as a proxy for the PushRecord method of the subloggers
func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	sublogger, ok := logger.subloggers[record.Name()]
	if !ok {
		return ErrLoggerNotFound{record.Name()}
	}

	return sublogger.PushRecord(record)
}

// PullRecord works as a proxy for the PullRecord method of the subloggers
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	loggerChecked, ok := logger.subloggers[request.Name()]
	if !ok {
		return nil, ErrLoggerNotFound{request.Name()}
	}
	return loggerChecked.PullRecord(request)
}

func (logger *Logger) Stop() error {
	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	if !logger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return nil
	}

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

	fmt.Println("Logger stopped")
	return nil
}

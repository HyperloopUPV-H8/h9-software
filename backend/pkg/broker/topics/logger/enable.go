package logger

import (
	"encoding/json"
	"fmt"
	"sync/atomic"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/google/uuid"
	ws "github.com/gorilla/websocket"
)

const EnableName abstraction.BrokerTopic = "logger/enable"
const ResponseName abstraction.BrokerTopic = "logger/response"

type Enable struct {
	isRunning   *atomic.Bool
	pool        *websocket.Pool
	subscribers map[websocket.ClientId]struct{}
	api         abstraction.BrokerAPI
}

func NewEnableTopic() *Enable {
	enable := &Enable{
		isRunning:   &atomic.Bool{},
		subscribers: make(map[websocket.ClientId]struct{}),
	}
	enable.isRunning.Store(false)
	return enable
}

func (enable *Enable) Topic() abstraction.BrokerTopic {
	return EnableName
}

func (enable *Enable) Push(push abstraction.BrokerPush) error {
	return nil
}

func (enable *Enable) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (enable *Enable) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	switch message.Topic {
	case EnableName:
		err := enable.handleToggle(id, message)
		if err != nil {
			fmt.Printf("error handling logger: %v\n", err)
		}
	case ResponseName:
		fmt.Printf("logger/response subscribed %s\n", uuid.UUID(id).String())
		enable.subscribers[id] = struct{}{}
	default:
		enable.pool.Disconnect(id, ws.CloseUnsupportedData, "unsupported topic")
		delete(enable.subscribers, id)
		fmt.Printf("logger/response unsubscribed %s\n", uuid.UUID(id).String())
	}
}

func (enable *Enable) handleToggle(_ websocket.ClientId, message *websocket.Message) error {
	var request bool
	err := json.Unmarshal(message.Payload, &request)
	if err != nil {
		return err
	}

	status := newStatus(request)
	go enable.api.UserPush(status)

	go func() {
		enable.isRunning.Store(<-status.response)
		enable.broadcastState()
	}()
	return nil
}

func (enable *Enable) broadcastState() error {
	payload, err := json.Marshal(enable.isRunning.Load())
	if err != nil {
		return err
	}

	message := websocket.Message{
		Topic:   ResponseName,
		Payload: payload,
	}

	flaged := make([]websocket.ClientId, 0, len(enable.subscribers))
	for id := range enable.subscribers {
		err := enable.pool.Write(id, message)
		if err != nil {
			flaged = append(flaged, id)
		}
	}

	for _, id := range flaged {
		enable.pool.Disconnect(id, ws.CloseInternalServerErr, "client disconnected")
		delete(enable.subscribers, id)
		fmt.Printf("logger/response unsubscribed %s\n", uuid.UUID(id).String())
	}

	return nil
}

func (enable *Enable) SetPool(pool *websocket.Pool) {
	enable.pool = pool
}

func (enable *Enable) SetAPI(api abstraction.BrokerAPI) {
	enable.api = api
}

type Status struct {
	request  bool
	response chan bool
}

func newStatus(request bool) *Status {
	return &Status{
		request:  request,
		response: make(chan bool),
	}
}

func (status *Status) Topic() abstraction.BrokerTopic {
	return EnableName
}

func (status *Status) Fulfill(response bool) {
	status.response <- response
}

func (status *Status) Enable() bool {
	return status.request
}

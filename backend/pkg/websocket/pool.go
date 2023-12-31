package websocket

import (
	"sync"

	"github.com/google/uuid"
	ws "github.com/gorilla/websocket"
)

type ClientId uuid.UUID

type messageCallback = func(ClientId, *Message)

type Pool struct {
	clientMx    *sync.Mutex
	clients     map[ClientId]*Client
	connections <-chan *Client
	onMessage   messageCallback
}

func NewPool(connections <-chan *Client) *Pool {
	handler := &Pool{
		clientMx:    &sync.Mutex{},
		clients:     make(map[ClientId]*Client),
		connections: connections,
		onMessage:   func(ClientId, *Message) {},
	}

	go handler.listen()

	return handler
}

func (pool *Pool) SetOnMessage(onMessage messageCallback) {
	pool.onMessage = onMessage
}

func (pool *Pool) listen() {
	for client := range pool.connections {
		id := ClientId(uuid.New())
		pool.clientMx.Lock()
		pool.clients[id] = client
		go pool.handle(id, client)
		client.SetOnClose(pool.onClose(id))
		pool.clientMx.Unlock()
	}
}

func (pool *Pool) handle(id ClientId, client *Client) {
	defer client.Close(ws.CloseNormalClosure, "server shutdown")
	for {
		message, err := client.Read()
		if err != nil {
			return
		}

		pool.onMessage(id, &message)
	}
}

func (pool *Pool) Write(id ClientId, message Message) error {
	pool.clientMx.Lock()
	defer pool.clientMx.Unlock()
	client, ok := pool.clients[id]
	if !ok {
		return ErrClientNotFound{Id: id}
	}

	return client.Write(message)
}

func (pool *Pool) Broadcast(message Message) {
	for id := range pool.clients {
		pool.Write(id, message)
	}
}

func (pool *Pool) Disconnect(id ClientId, code int, reason string) error {
	pool.clientMx.Lock()
	defer pool.clientMx.Unlock()

	if client, ok := pool.clients[id]; ok {
		return client.Close(code, reason)
	}
	return nil
}

func (pool *Pool) onClose(id ClientId) func() {
	return func() {
		pool.clientMx.Lock()
		defer pool.clientMx.Unlock()

		delete(pool.clients, id)
	}
}

func (pool *Pool) Close() error {
	pool.clientMx.Lock()
	defer pool.clientMx.Unlock()

	for _, client := range pool.clients {
		client.Close(ws.CloseNormalClosure, "server shutdown")
	}

	return nil
}

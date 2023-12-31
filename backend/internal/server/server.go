package server

import (
	"encoding/json"
	"net/http"
	"sync/atomic"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/gorilla/mux"
)

type WebServer struct {
	name      string
	router    *mux.Router
	upgrader  *websocket.Upgrader
	connected *atomic.Int32
	config    ServerConfig
}

func NoCacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Pragma", "no-cache")
		next.ServeHTTP(w, r)
	})
}

func NewWebServer(name string, upgrader *websocket.Upgrader, staticData EndpointData, config ServerConfig) (*WebServer, error) {
	server := &WebServer{
		name:      name,
		router:    mux.NewRouter(),
		upgrader:  upgrader,
		connected: &atomic.Int32{},
		config:    config,
	}

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
	}

	err := server.serveJSON("/backend"+config.Endpoints.PodData, staticData.PodData, headers)
	if err != nil {
		return nil, err
	}

	err = server.serveJSON("/backend"+config.Endpoints.OrderData, staticData.OrderData, headers)
	if err != nil {
		return nil, err
	}

	err = server.serveJSON("/backend"+config.Endpoints.ProgramableBoards, staticData.ProgramableBoards, headers)
	if err != nil {
		return nil, err
	}

	server.router.Handle(config.Endpoints.Connections, server.upgrader)
	server.serveFiles(config.Endpoints.Files, config.StaticPath)

	if err != nil {
		return nil, err
	}

	return server, nil
}

func (server *WebServer) serveJSON(path string, data any, headers map[string]string) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		for key, value := range headers {
			w.Header().Set(key, value)
		}
		w.Write(jsonData)
	})

	server.router.Handle(path, NoCacheMiddleware(handler))

	return nil
}

func (server *WebServer) serveFiles(path string, staticPath string) {
	server.router.PathPrefix(path).Handler(NoCacheMiddleware(http.FileServer(http.Dir(staticPath))))
}

func (server *WebServer) ListenAndServe() <-chan error {
	errs := make(chan error, 1)

	go func() {
		errs <- http.ListenAndServe(server.config.Addr, server.router)
		close(errs)
	}()

	return errs
}

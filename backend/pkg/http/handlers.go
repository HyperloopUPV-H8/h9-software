package http

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

type handleData struct {
	name    string
	modTime time.Time
	data    io.ReadSeeker
}

func HandleData(name string, data io.ReadSeeker) *handleData {
	return &handleData{
		name:    name,
		modTime: time.Now(),
		data:    data,
	}
}

func HandleDataJSON(name string, data any) (*handleData, error) {
	raw, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	reader := bytes.NewReader(raw)

	return HandleData(name, reader), nil
}

func (handle *handleData) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()

	writer.Header().Set("Access-Control-Allow-Origin", "*")
	http.ServeContent(writer, request, handle.name, handle.modTime, handle.data)
}

type handleStatic struct {
	path string
}

func HandleStatic(path string) *handleStatic {
	return &handleStatic{
		path: path,
	}
}

func (handle *handleStatic) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()

	writer.Header().Set("Access-Control-Allow-Origin", "*")
	http.ServeFile(writer, request, handle.path)
}

package blcu

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

const DownloadName abstraction.BrokerTopic = "blcu/download"

type Download struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (download *Download) Topic() abstraction.BrokerTopic {
	return DownloadName
}

func (download *Download) UserPush(push abstraction.BrokerPush) error {
	return download.api.UserPush(push)
}

func (download *Download) UserPull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return download.api.UserPull(request)
}

func (download *Download) SetPool(pool *websocket.Pool) {
	download.pool = pool
}

func (download *Download) SetAPI(api abstraction.BrokerAPI) {
	download.api = api
}

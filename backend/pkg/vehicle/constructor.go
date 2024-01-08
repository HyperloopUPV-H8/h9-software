package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// New creates a new Vehicle with no modules registered on it
func New() Vehicle {
	return Vehicle{
		boards: make(map[abstraction.BoardId]abstraction.Board),
	}
}

// SetBroker sets the Vehicle Broker to the provided one
func (vehicle *Vehicle) SetBroker(broker abstraction.Broker) {
	broker.SetAPI(vehicle)
	vehicle.broker = broker
}

// AddBoard adds a Board to the Vehicle
func (vehicle *Vehicle) AddBoard(board abstraction.Board) {
	board.SetAPI(vehicle)
	vehicle.boards[board.Id()] = board
}

// RemoveBoard removes a Board from the Vehicle
func (vehicle *Vehicle) RemoveBoard(board abstraction.Board) {
	delete(vehicle.boards, board.Id())
}

// RemoveBoardId removes a Board from the Vehicle based on its ID
func (vehicle *Vehicle) RemoveBoardId(id abstraction.BoardId) {
	delete(vehicle.boards, id)
}

// SetTransport sets the Vehicle Transport to the provided one
func (vehicle *Vehicle) SetTransport(transport abstraction.Transport) {
	transport.SetAPI(vehicle)
	vehicle.transport = transport
}

// SetLogger sets the Vehicle Logger to the provided one
func (vehicle *Vehicle) SetLogger(logger abstraction.Logger) {
	vehicle.logger = logger
}

func (vehicle *Vehicle) SetUpdateFactory(updateFactory *update_factory.UpdateFactory) {
	vehicle.updateFactory = updateFactory
}

func (vehicle *Vehicle) SetIdToBoardName(idToBoardName map[uint16]string) {
	vehicle.idToBoardName = idToBoardName
}

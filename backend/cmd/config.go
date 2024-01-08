package main

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter"
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
)

type Config struct {
	Excel   excel_adapter.ExcelAdapterConfig
	Vehicle vehicle.Config
	Server  server.Config
}

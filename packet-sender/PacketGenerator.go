package main

import (
	"bytes"
	"encoding/binary"
	"log"
	"math"
	"math/rand"
	"strconv"
	"strings"
	"time"

	excelAdapter "github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/internals"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/models"
)

type PacketGenerator struct {
	packets []Packet
}

func New() PacketGenerator {
	excelAdapter := excelAdapter.New(excelAdapter.ExcelAdapterConfig{
		Download: internals.DownloadConfig{
			Id:   "1NyNaAOw_6iWtnCpEg73AtSSFx1fMdhPRmmdOhjgjCZI",
			Path: ".",
			Name: "ade.xlsx",
		},
		Parse: internals.ParseConfig{
			GlobalSheetPrefix: "GLOBAL ",
			BoardSheetPrefix:  "BOARD ",
			TablePrefix:       "[TABLE] ",
			Global: internals.GlobalParseConfig{
				AddressTable:    "addresses",
				BackendKey:      "Backend",
				BLCUAddressKey:  "BLCU",
				UnitsTable:      "units",
				PortsTable:      "ports",
				BoardIdsTable:   "board_ids",
				MessageIdsTable: "message_ids",
			},
		},
	})

	boards := excelAdapter.GetBoards()
	packets := make([]Packet, 0)

	for _, board := range boards {
		for _, packet := range board.Packets {
			if packet.Description.Type != "data" {
				continue
			}

			id, err := strconv.ParseUint(packet.Description.ID, 10, 16)
			if err != nil {
				log.Fatalf("data transfer: AddPacket: %s\n", err)
			}

			packets = append(packets, Packet{
				ID:           uint16(id),
				Name:         packet.Description.Name,
				HexValue:     "",
				Count:        0,
				CycleTime:    0,
				Measurements: getMeasurements(packet.Values),
			})
		}
	}

	pg := PacketGenerator{
		packets: packets,
	}

	return pg
}

func (pg *PacketGenerator) CreateRandomPacket() []byte {
	randomIndex := rand.Int63n(int64(len(pg.packets)))
	randomPacket := pg.packets[randomIndex]

	buff := bytes.NewBuffer(make([]byte, 0))

	binary.Write(buff, binary.LittleEndian, randomPacket.ID)

	for _, measurement := range randomPacket.Measurements {
		if strings.Contains(measurement.Type, "enum") {
			binary.Write(buff, binary.LittleEndian, uint8(rand.Int63n(int64(len(strings.Split(strings.ReplaceAll(strings.TrimSuffix(strings.TrimPrefix(measurement.Type, "enum("), ")"), " ", ""), ","))))))
		} else if measurement.Type == "bool" {
			binary.Write(buff, binary.LittleEndian, rand.Int31n(2) == 1)
		} else if measurement.Type != "string" {
			var number float64
			if len(measurement.WarningRange) == 0 {
				number = mapNumberToRange(rand.Float64(), measurement.WarningRange, measurement.Type)
			} else {
				number = mapNumberToRange(rand.Float64(), []float64{measurement.WarningRange[0] * 0.8, measurement.WarningRange[1] * 1.2}, measurement.Type)
			}
			writeNumberAsBytes(number, measurement.Type, buff)
		} else {
			return nil
		}

	}

	return buff.Bytes()
}

func (pg *PacketGenerator) CreateSinePacket() []byte {
	randomIndex := rand.Int63n(int64(len(pg.packets)))
	randomPacket := pg.packets[randomIndex]

	buff := bytes.NewBuffer(make([]byte, 0))

	binary.Write(buff, binary.LittleEndian, randomPacket.ID)

	for _, measurement := range randomPacket.Measurements {
		if strings.Contains(measurement.Type, "enum") {
			binary.Write(buff, binary.LittleEndian, uint8(1))
		} else if measurement.Type != "string" {
			sineValue := generateSinusoidalValue()
			number := mapNumberToRange(sineValue, measurement.SafeRange, measurement.Type)
			writeNumberAsBytes(number, measurement.Type, buff)
		} else {
			return nil
		}
	}

	return buff.Bytes()
}

func generateSinusoidalValue() float64 {
	amplitude := 1.0
	frequency := 0.01
	phase := 0.0

	value := amplitude * math.Sin(2*math.Pi*frequency*float64(time.Now().Unix())+phase)
	return value
}

func mapNumberToRange(number float64, numberRange []float64, numberType string) float64 {
	if len(numberRange) == 0 {
		return number * getTypeMaxValue(numberType)
	} else {
		return (number * (numberRange[1] - numberRange[0])) + numberRange[0]
	}
}

func getTypeMaxValue(numberType string) float64 {
	switch numberType {
	case "uint8":
		return math.MaxUint8
	case "uint16":
		return math.MaxUint16
	case "uint32":
		return math.MaxUint32
	case "uint64":
		return math.MaxUint64
	case "int8":
		return math.MaxInt8
	case "int16":
		return math.MaxInt16
	case "int32":
		return math.MaxInt32
	case "int64":
		return math.MaxInt64
	case "float32":
		return math.MaxFloat32
	case "float64":
		return math.MaxFloat64
	case "bool":
		return math.MaxUint8
	default:
		return math.MaxUint8
	}
}

func writeNumberAsBytes(number float64, numberType string, buff *bytes.Buffer) {
	switch numberType {
	case "uint8":
		binary.Write(buff, binary.LittleEndian, uint8(number))
	case "uint16":
		binary.Write(buff, binary.LittleEndian, uint16(number))

	case "uint32":
		binary.Write(buff, binary.LittleEndian, uint32(number))

	case "uint64":
		binary.Write(buff, binary.LittleEndian, uint64(number))

	case "int8":
		binary.Write(buff, binary.LittleEndian, int8(number))

	case "int16":
		binary.Write(buff, binary.LittleEndian, int16(number))

	case "int32":
		binary.Write(buff, binary.LittleEndian, int32(number))

	case "int64":
		binary.Write(buff, binary.LittleEndian, int64(number))

	case "float32":
		binary.Write(buff, binary.LittleEndian, float32(number))

	case "float64":
		binary.Write(buff, binary.LittleEndian, number)

	case "bool":
		binary.Write(buff, binary.LittleEndian, uint8(number))

	default:
		binary.Write(buff, binary.LittleEndian, uint8(number))
	}
}

func (pg *PacketGenerator) AddPacket(boardName string, packet models.Packet) {
	if packet.Description.Type != "data" {
		return
	}

	id, err := strconv.ParseUint(packet.Description.ID, 10, 16)
	if err != nil {
		log.Fatalf("data transfer: AddPacket: %s\n", err)
	}

	pg.packets = append(pg.packets, Packet{
		ID:           uint16(id),
		Name:         packet.Description.Name,
		HexValue:     "",
		Count:        0,
		CycleTime:    0,
		Measurements: getMeasurements(packet.Values),
	})

}

func getMeasurements(values []models.Value) []Measurement {
	measurements := make([]Measurement, 0, len(values))
	for _, value := range values {
		measurements = append(measurements,
			Measurement{
				ID:   value.ID,
				Name: value.Name,
				Type: value.Type,
				//TODO: make sure added property (Value) doesn't break stuff
				Value:        getDefaultValue(value.Type),
				Units:        value.DisplayUnits,
				SafeRange:    parseRange(value.SafeRange),
				WarningRange: parseRange(value.WarningRange),
			},
		)
	}
	return measurements
}

func parseRange(literal string) []float64 {
	if literal == "" {
		return make([]float64, 0)
	}

	strRange := strings.Split(strings.TrimSuffix(strings.TrimPrefix(strings.Replace(literal, " ", "", -1), "["), "]"), ",")

	if len(strRange) != 2 {
		log.Fatalf("pod data: parseRange: invalid range %s\n", literal)
	}

	numRange := make([]float64, 0)

	if strRange[0] != "" {
		lowerBound, errLowerBound := strconv.ParseFloat(strRange[0], 64)

		if errLowerBound != nil {
			log.Fatal("error parsing lower bound")
		}

		numRange = append(numRange, lowerBound)
	}

	if strRange[1] != "" {
		upperBound, errUpperBound := strconv.ParseFloat(strRange[1], 64)

		if errUpperBound != nil {
			log.Fatal("error parsing lower bound")
		}

		numRange = append(numRange, upperBound)
	}

	return numRange
}

func getDefaultValue(valueType string) any {
	switch valueType {
	case "uint8", "uint16", "uint32", "uint64", "int8", "int16", "int32", "int64", "float32", "float64":
		return 0
	case "bool":
		return false
	default:
		return "Default"
	}
}

type Packet struct {
	ID           uint16        `json:"id"`
	Name         string        `json:"name"`
	HexValue     string        `json:"hexValue"`
	Count        uint16        `json:"count"`
	CycleTime    int64         `json:"cycleTime"`
	Measurements []Measurement `json:"measurements"`
}

type Measurement struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	Value        any       `json:"value"`
	Units        string    `json:"units"`
	SafeRange    []float64 `json:"safeRange"`
	WarningRange []float64 `json:"warningRange"`
}

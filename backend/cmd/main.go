package main

import (
	"bufio"
	"encoding/binary"
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"path"
	"runtime"
	"runtime/pprof"
	"strings"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/ade"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/utils"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory"
	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	connection_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/connection"
	data_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/data"
	logger_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/logger"
	message_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/message"
	order_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/order"
	h "github.com/HyperloopUPV-H8/h9-backend/pkg/http"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	data_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	messages_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/messages"
	order_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	state_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/state"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	blcu_packet "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	info_packet "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/info"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/vehicle"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/fatih/color"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/pelletier/go-toml/v2"
	trace "github.com/rs/zerolog/log"
)

var traceLevel = flag.String("trace", "info", "set the trace level (\"fatal\", \"error\", \"warn\", \"info\", \"debug\", \"trace\")")
var traceFile = flag.String("log", "trace.json", "set the trace log file")
var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")

func main() {
	flag.Parse()
	traceFile := initTrace(*traceLevel, *traceFile)
	defer traceFile.Close()

	pidPath := path.Join(os.TempDir(), "backendPid")

	createPid(pidPath)
	defer RemovePid(pidPath)

	runtime.GOMAXPROCS(runtime.NumCPU())
	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal(err)
		}
		pprof.StartCPUProfile(f)
		defer pprof.StopCPUProfile()
	}
	config := getConfig("./config.toml")

	file, err := excel.Download(excel.DownloadConfig(config.Excel.Download))
	if err != nil {
		trace.Fatal().Err(err).Msg("downloading file")
	}

	ade, err := ade.CreateADE(file)
	if err != nil {
		trace.Fatal().Err(err).Msg("creating ade")
	}

	info, err := info.NewInfo(ade.Info)
	if err != nil {
		trace.Fatal().Err(err).Msg("creating info")
	}

	podData, err := pod_data.NewPodData(ade.Boards, info.Units)
	if err != nil {
		fmt.Println(err)
		trace.Fatal().Err(err).Msg("creating podData")
	}

	dev, err := selectDev()
	if err != nil {
		trace.Fatal().Err(err).Msg("Error selecting device")
		panic(err)
	}

	vehicleOrders, err := vehicle_models.NewVehicleOrders(podData.Boards, config.Excel.Parse.Global.BLCUAddressKey)
	if err != nil {
		trace.Fatal().Err(err).Msg("creating vehicleOrders")
	}

	// <--- update factory --->
	updateFactory := update_factory.NewFactory()

	// <--- logger --->
	var boardMap map[abstraction.BoardId]string
	var subloggers = map[abstraction.LoggerName]abstraction.Logger{
		data_logger.Name:     data_logger.NewLogger(),
		messages_logger.Name: messages_logger.NewLogger(boardMap),
		order_logger.Name:    order_logger.NewLogger(),
		state_logger.Name:    state_logger.NewLogger(),
	}

	loggerHandler := logger.NewLogger(subloggers)

	// <--- order transfer --->
	idToBoard := make(map[uint16]string)
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			idToBoard[packet.Id] = board.Name
		}
	}

	// <--- broker --->
	broker := broker.New()

	dataTopic := data_topic.NewUpdateTopic(time.Second / 10)
	defer dataTopic.Stop()
	connectionTopic := connection_topic.NewUpdateTopic()
	orderTopic := order_topic.NewSendTopic()
	loggerTopic := logger_topic.NewEnableTopic()
	boardIdToBoard := make(map[abstraction.BoardId]string)
	for name, id := range info.BoardIds {
		boardIdToBoard[abstraction.BoardId(id)] = name
	}
	messageTopic := message_topic.NewUpdateTopic(boardIdToBoard)

	broker.AddTopic(data_topic.UpdateName, dataTopic)
	broker.AddTopic(connection_topic.UpdateName, connectionTopic)
	broker.AddTopic(order_topic.SendName, orderTopic)
	broker.AddTopic(logger_topic.EnableName, loggerTopic)
	broker.AddTopic(message_topic.UpdateName, messageTopic)

	connections := make(chan *websocket.Client)
	upgrader := websocket.NewUpgrader(connections)
	pool := websocket.NewPool(connections)
	broker.SetPool(pool)

	// <--- transport --->
	orders := make(map[abstraction.PacketId]struct{})
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			if packet.Type == "order" {
				orders[abstraction.PacketId(packet.Id)] = struct{}{}
			}
		}
	}

	transp := transport.NewTransport()

	// Load and set packet decoder and encoder
	decoder, encoder := getTransportDecEnc(info, podData)
	transp.WithDecoder(decoder).WithEncoder(encoder)

	// Set package id to target map
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			transp.SetIdTarget(abstraction.PacketId(packet.Id), abstraction.TransportTarget(board.Name))
		}
	}

	// Start handling TCP client connections
	backendTcpClientAddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", info.Addresses.Backend.String(), info.Ports.TcpClient))
	if err != nil {
		panic("Failed to resolve local backend TCP client address")
	}
	serverTargets := make(map[string]abstraction.TransportTarget)
	for _, board := range podData.Boards {
		if !common.Contains(config.Vehicle.Boards, board.Name) {
			serverTargets[fmt.Sprintf("%s:%d", info.Addresses.Boards[board.Name], info.Ports.TcpClient)] = abstraction.TransportTarget(board.Name)
			continue
		}
		go transp.HandleClient(tcp.NewClient(backendTcpClientAddr), abstraction.TransportTarget(board.Name), "tcp", fmt.Sprintf("%s:%d", info.Addresses.Boards[board.Name], info.Ports.TcpServer))
	}

	// Start handling TCP server connections
	go transp.HandleServer(tcp.NewServer(serverTargets), "tcp", fmt.Sprintf("%s:%d", info.Addresses.Backend, info.Ports.TcpServer))

	// Start handling the sniffer
	source, err := pcap.OpenLive(dev.Name, 1500, true, pcap.BlockForever)
	if err != nil {
		panic("failed to obtain sniffer source: " + err.Error())
	}
	boardIps := make([]net.IP, 0)
	for _, board := range info.Addresses.Boards {
		boardIps = append(boardIps, board)
	}
	err = source.SetBPFFilter(getFilter(boardIps, info.Addresses.Backend, info.Ports.UDP, info.Ports.TcpClient, info.Ports.TcpServer))
	if err != nil {
		panic("failed to compile bpf filter")
	}
	go transp.HandleSniffer(sniffer.New(source, &layers.LayerTypeEthernet))

	// <--- vehicle --->
	vehicle := vehicle.New()
	vehicle.SetBroker(broker)
	vehicle.SetLogger(loggerHandler)
	vehicle.SetUpdateFactory(updateFactory)
	vehicle.SetIdToBoardName(idToBoard)
	vehicle.SetTransport(transp)

	// <--- http server --->
	podDataHandle, err := h.HandleDataJSON("podData.json", pod_data.GetDataOnlyPodData(podData))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating podData handler: %v\n", err)
	}
	orderDataHandle, err := h.HandleDataJSON("orderData.json", vehicleOrders)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating orderData handler: %v\n", err)
	}
	uploadableBords := common.Filter(common.Keys(info.Addresses.Boards), func(item string) bool {
		return item != config.Excel.Parse.Global.BLCUAddressKey
	})
	programableBoardsHandle, err := h.HandleDataJSON("programableBoards.json", uploadableBords)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating programableBoards handler: %v\n", err)
	}

	for _, server := range config.Server {
		mux := h.NewMux(
			h.Endpoint("/backend"+server.Endpoints.PodData, podDataHandle),
			h.Endpoint("/backend"+server.Endpoints.OrderData, orderDataHandle),
			h.Endpoint("/backend"+server.Endpoints.ProgramableBoards, programableBoardsHandle),
			h.Endpoint(server.Endpoints.Connections, upgrader),
			h.Endpoint(server.Endpoints.Files, h.HandleStatic(server.StaticPath)),
		)

		httpServer := h.NewServer(server.Addr, mux)
		go httpServer.ListenAndServe()
	}

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	for range interrupt {
		trace.Info().Msg("Shutting down")
		return
	}
}

func createPid(path string) {
	err := WritePid(path)

	if err != nil {
		switch err {
		case ErrProcessRunning:
			trace.Fatal().Err(err).Msg("Backend is already running")
		default:
			trace.Error().Err(err).Msg("pid error")
		}
	}
}

func selectDev() (pcap.Interface, error) {
	devs, err := pcap.FindAllDevs()
	if err != nil {
		return pcap.Interface{}, err
	}

	cyan := color.New(color.FgCyan)

	cyan.Print("select a device: ")
	fmt.Printf("(0-%d)\n", len(devs)-1)
	for i, dev := range devs {
		displayDev(i, dev)
	}

	dev, err := acceptInput(len(devs))
	if err != nil {
		return pcap.Interface{}, err
	}

	return devs[dev], nil
}

func displayDev(i int, dev pcap.Interface) {
	red := color.New(color.FgRed)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	red.Printf("\t%d", i)
	fmt.Print(": (")
	yellow.Print(dev.Name)
	fmt.Printf(") %s [", dev.Description)
	for _, addr := range dev.Addresses {
		green.Printf("%s", addr.IP)
		fmt.Print(", ")
	}
	fmt.Println("]")
}

func acceptInput(limit int) (int, error) {
	blue := color.New(color.FgBlue)
	red := color.New(color.FgRed)

	for {
		blue.Print(">>> ")

		reader := bufio.NewReader(os.Stdin)
		input, err := reader.ReadString('\n')
		if err != nil {
			return 0, err
		}

		var dev int
		_, err = fmt.Sscanf(input, "%d", &dev)
		if err != nil {
			red.Printf("%s\n\n", err)
			continue
		}

		if dev < 0 || dev >= limit {
			red.Println("invalid device selected")
			continue
		} else {
			return dev, nil
		}
	}
}

func getConfig(path string) Config {
	configFile, fileErr := os.ReadFile(path)

	if fileErr != nil {
		trace.Fatal().Stack().Err(fileErr).Msg("error reading config file")
	}

	reader := strings.NewReader(string(configFile))

	var config Config

	// TODO: add strict mode (DisallowUnkownFields)
	decodeErr := toml.NewDecoder(reader).Decode(&config)

	if decodeErr != nil {
		trace.Fatal().Stack().Err(decodeErr).Msg("error unmarshaling toml file")
	}

	return config
}

func getTransportDecEnc(info info.Info, podData pod_data.PodData) (*presentation.Decoder, *presentation.Encoder) {
	decoder := presentation.NewDecoder(binary.LittleEndian)
	encoder := presentation.NewEncoder(binary.LittleEndian)

	dataDecoder := data.NewDecoder(binary.LittleEndian)
	dataEncoder := data.NewEncoder(binary.LittleEndian)

	ids := make([]abstraction.PacketId, 0)
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			descriptor := make(data.Descriptor, len(packet.Measurements))
			for i, measurement := range packet.Measurements {
				switch meas := measurement.(type) {
				case pod_data.NumericMeasurement:
					podOps := getOps(meas.PodUnits)
					displayOps := getOps(meas.DisplayUnits)
					switch meas.Type {
					case "uint8":
						descriptor[i] = data.NewNumericDescriptor[uint8](data.ValueName(meas.Id), podOps, displayOps)
					case "uint16":
						descriptor[i] = data.NewNumericDescriptor[uint16](data.ValueName(meas.Id), podOps, displayOps)
					case "uint32":
						descriptor[i] = data.NewNumericDescriptor[uint32](data.ValueName(meas.Id), podOps, displayOps)
					case "uint64":
						descriptor[i] = data.NewNumericDescriptor[uint64](data.ValueName(meas.Id), podOps, displayOps)
					case "int8":
						descriptor[i] = data.NewNumericDescriptor[int8](data.ValueName(meas.Id), podOps, displayOps)
					case "int16":
						descriptor[i] = data.NewNumericDescriptor[int16](data.ValueName(meas.Id), podOps, displayOps)
					case "int32":
						descriptor[i] = data.NewNumericDescriptor[int32](data.ValueName(meas.Id), podOps, displayOps)
					case "int64":
						descriptor[i] = data.NewNumericDescriptor[int64](data.ValueName(meas.Id), podOps, displayOps)
					case "float32":
						descriptor[i] = data.NewNumericDescriptor[float32](data.ValueName(meas.Id), podOps, displayOps)
					case "float64":
						descriptor[i] = data.NewNumericDescriptor[float64](data.ValueName(meas.Id), podOps, displayOps)
					default:
						panic(fmt.Sprintf("unexpected numeric type for %s: %s", meas.Id, meas.Type))
					}
				case pod_data.BooleanMeasurement:
					descriptor[i] = data.NewBooleanDescriptor(data.ValueName(meas.Id))
				case pod_data.EnumMeasurement:
					enumDescriptor := make(data.EnumDescriptor, len(meas.Options))
					for j, option := range meas.Options {
						enumDescriptor[j] = data.EnumVariant(option)
					}
					descriptor[i] = data.NewEnumDescriptor(data.ValueName(meas.Id), enumDescriptor)
				default:
					panic(fmt.Sprintf("unexpected measurement type: %T", measurement))
				}
			}
			dataDecoder.SetDescriptor(abstraction.PacketId(packet.Id), descriptor)
			dataEncoder.SetDescriptor(abstraction.PacketId(packet.Id), descriptor)
			ids = append(ids, abstraction.PacketId(packet.Id))
		}
	}

	for _, id := range ids {
		decoder.SetPacketDecoder(id, dataDecoder)
		encoder.SetPacketEncoder(id, dataEncoder)
	}

	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.BlcuAck), blcu_packet.NewDecoder())

	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.Info), info_packet.NewDecoder(0))

	stateOrdersDecoder := order.NewDecoder(binary.LittleEndian)
	stateOrdersDecoder.SetActionId(abstraction.PacketId(info.MessageIds.AddStateOrder), stateOrdersDecoder.DecodeAdd)
	stateOrdersDecoder.SetActionId(abstraction.PacketId(info.MessageIds.RemoveStateOrder), stateOrdersDecoder.DecodeRemove)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.AddStateOrder), stateOrdersDecoder)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.RemoveStateOrder), stateOrdersDecoder)

	protectionDecoder := protection.NewDecoder()
	protectionDecoder.SetSeverity(abstraction.PacketId(info.MessageIds.Warning), protection.SeverityWarning)
	protectionDecoder.SetSeverity(abstraction.PacketId(info.MessageIds.Fault), protection.SeverityFault)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.Warning), protectionDecoder)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.Fault), protectionDecoder)

	return decoder, encoder
}

func getOps(units utils.Units) data.ConversionDescriptor {
	output := make(data.ConversionDescriptor, len(units.Operations))
	for i, operation := range units.Operations {
		output[i] = data.Operation{
			Operator: operation.Operator,
			Operand:  operation.Operand,
		}
	}
	return output
}

func getFilter(boardAddrs []net.IP, backendAddr net.IP, udpPort uint16, tcpClientPort uint16, tcpServerPort uint16) string {
	ipipFilter := getIPIPfilter()
	udpFilter := getUDPFilter(boardAddrs, udpPort)
	tcpFilter := getTCPFilter(boardAddrs, tcpServerPort, tcpClientPort)
	// noBackend := "not host 192.168.0.9"

	// filter := fmt.Sprintf("((%s) or (%s) or (%s)) and (%s)", ipipFilter, udpFilter, tcpFilter, noBackend)

	filter := fmt.Sprintf("(%s) or (%s) or (%s)", ipipFilter, udpFilter, tcpFilter)

	trace.Trace().Any("addrs", boardAddrs).Str("filter", filter).Msg("new filter")
	return filter
}

func getIPIPfilter() string {
	return "ip[9] == 4"
}

func getUDPFilter(addrs []net.IP, port uint16) string {
	udpPort := fmt.Sprintf("udp port %d", port)
	udpAddrs := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(src host %s)", addr)
	})

	udpAddrsStr := strings.Join(udpAddrs, " or ")

	return fmt.Sprintf("(%s) and (%s)", udpPort, udpAddrsStr)
}

func getTCPFilter(addrs []net.IP, serverPort uint16, clientPort uint16) string {
	ports := fmt.Sprintf("tcp port %d or %d", serverPort, clientPort)
	notSynFinRst := "tcp[tcpflags] & (tcp-fin | tcp-syn | tcp-rst) == 0"
	notJustAck := "tcp[tcpflags] | tcp-ack != 16"
	nonZeroPayload := "tcp[tcpflags] & tcp-push != 0"

	srcAddresses := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(src host %s)", addr)
	})

	srcAddressesStr := strings.Join(srcAddresses, " or ")

	dstAddresses := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(dst host %s)", addr)
	})

	dstAddressesStr := strings.Join(dstAddresses, " or ")

	filter := fmt.Sprintf("(%s) and (%s) and (%s) and (%s) and (%s) and (%s)", ports, notSynFinRst, notJustAck, nonZeroPayload, srcAddressesStr, dstAddressesStr)
	return filter
}

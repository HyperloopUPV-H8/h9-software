package main

import (
	"bufio"
	"context"
	"encoding/binary"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
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
	order_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	protection_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/protection"
	state_logger "github.com/HyperloopUPV-H8/h9-backend/pkg/logger/state"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	blcu_packet "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/vehicle"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/fatih/color"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/jmaralo/sntp"
	"github.com/pelletier/go-toml/v2"
	trace "github.com/rs/zerolog/log"
)

var traceLevel = flag.String("trace", "info", "set the trace level (\"fatal\", \"error\", \"warn\", \"info\", \"debug\", \"trace\")")
var traceFile = flag.String("log", "trace.json", "set the trace log file")
var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")
var enableSNTP = flag.Bool("sntp", false, "enables a simple SNTP server on port 123")
var networkDevice = flag.Int("dev", -1, "index of the network device to use, overrides device prompt")
var blockprofile = flag.Int("blockprofile", 0, "number of block profiles to include")

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
	runtime.SetBlockProfileRate(*blockprofile)
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

	var dev pcap.Interface
	if *networkDevice != -1 {
		devs, err := pcap.FindAllDevs()
		if err != nil {
			trace.Fatal().Err(err).Msg("Getting devices")
		}

		dev = devs[*networkDevice]
	} else {
		dev, err = selectDev()
		if err != nil {
			trace.Fatal().Err(err).Msg("Error selecting device")
		}
	}

	vehicleOrders, err := vehicle_models.NewVehicleOrders(podData.Boards, config.Excel.Parse.Global.BLCUAddressKey)
	if err != nil {
		trace.Fatal().Err(err).Msg("creating vehicleOrders")
	}

	// <--- update factory --->
	boardToPackets := make(map[abstraction.TransportTarget][]uint16)
	for _, board := range podData.Boards {
		packetIds := make([]uint16, len(board.Packets))
		for i, packet := range board.Packets {
			packetIds[i] = packet.Id
		}
		boardToPackets[abstraction.TransportTarget(board.Name)] = packetIds
	}
	updateFactory := update_factory.NewFactory(boardToPackets)

	// <--- logger --->
	var boardMap map[abstraction.BoardId]string
	var subloggers = map[abstraction.LoggerName]abstraction.Logger{
		data_logger.Name:       data_logger.NewLogger(),
		protection_logger.Name: protection_logger.NewLogger(boardMap),
		order_logger.Name:      order_logger.NewLogger(),
		state_logger.Name:      state_logger.NewLogger(),
	}

	loggerHandler := logger.NewLogger(subloggers, trace.Logger)

	// <--- order transfer --->
	idToBoard := make(map[uint16]string)
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			idToBoard[packet.Id] = board.Name
		}
	}

	// <--- broker --->
	broker := broker.New(trace.Logger)

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
	stateOrderTopic := order_topic.NewState(idToBoard, trace.Logger)

	broker.AddTopic(data_topic.UpdateName, dataTopic)
	broker.AddTopic(connection_topic.UpdateName, connectionTopic)
	broker.AddTopic(order_topic.SendName, orderTopic)
	broker.AddTopic(order_topic.StateName, stateOrderTopic)
	broker.AddTopic(logger_topic.EnableName, loggerTopic)
	broker.AddTopic(logger_topic.ResponseName, loggerTopic)
	broker.AddTopic(message_topic.UpdateName, messageTopic)

	connections := make(chan *websocket.Client)
	upgrader := websocket.NewUpgrader(connections, trace.Logger)
	pool := websocket.NewPool(connections, trace.Logger)
	broker.SetPool(pool)

	// <--- transport --->
	transp := transport.NewTransport(trace.Logger)

	// <--- vehicle --->
	ipToBoardId := make(map[string]abstraction.BoardId)
	for name, ip := range info.Addresses.Boards {
		ipToBoardId[ip.String()] = abstraction.BoardId(info.BoardIds[name])
	}

	vehicle := vehicle.New(trace.Logger)
	vehicle.SetBroker(broker)
	vehicle.SetLogger(loggerHandler)
	vehicle.SetUpdateFactory(updateFactory)
	vehicle.SetIpToBoardId(ipToBoardId)
	vehicle.SetIdToBoardName(idToBoard)
	vehicle.SetTransport(transp)

	// <--- transport --->
	// Load and set packet decoder and encoder
	decoder, encoder := getTransportDecEnc(info, podData)
	transp.WithDecoder(decoder).WithEncoder(encoder)

	// Set package id to target map
	for _, board := range podData.Boards {
		for _, packet := range board.Packets {
			transp.SetIdTarget(abstraction.PacketId(packet.Id), abstraction.TransportTarget(board.Name))
		}
		transp.SetTargetIp(info.Addresses.Boards[board.Name].String(), abstraction.TransportTarget(board.Name))
	}

	// Start handling TCP client connections
	i := 0
	serverTargets := make(map[string]abstraction.TransportTarget)
	for _, board := range podData.Boards {
		if !common.Contains(config.Vehicle.Boards, board.Name) {
			serverTargets[fmt.Sprintf("%s:%d", info.Addresses.Boards[board.Name], info.Ports.TcpClient)] = abstraction.TransportTarget(board.Name)
			continue
		}
		backendTcpClientAddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", info.Addresses.Backend.String(), info.Ports.TcpClient+uint16(i)))
		if err != nil {
			panic("Failed to resolve local backend TCP client address")
		}
		go transp.HandleClient(tcp.NewClientConfig(backendTcpClientAddr), fmt.Sprintf("%s:%d", info.Addresses.Boards[board.Name], info.Ports.TcpServer))
		i++
	}

	// Start handling TCP server connections
	go transp.HandleServer(tcp.ServerConfig{
		ListenConfig: net.ListenConfig{
			KeepAlive: time.Second,
		},
		Context: context.TODO(),
	}, fmt.Sprintf("%s:%d", info.Addresses.Backend, info.Ports.TcpServer))

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
	go func() {
		sniffer := sniffer.New(source, &layers.LayerTypeEthernet, trace.Logger)
		for {
			errChan := transp.HandleSniffer(sniffer)
			trace.Error().Stack().Err(<-errChan).Msg("sniffer crashed, restarting...")
		}
	}()

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

	go http.ListenAndServe("127.0.0.1:4040", nil)

	// <--- SNTP --->
	if *enableSNTP {
		sntpAddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", info.Addresses.Backend, info.Ports.SNTP))
		if err != nil {
			fmt.Fprintf(os.Stderr, "error resolving sntp address: %v\n", err)
			os.Exit(1)
		}
		sntpServer, err := sntp.NewUnicast("udp", sntpAddr)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating sntp server: %v\n", err)
			os.Exit(1)
		}

		go func() {
			err := sntpServer.ListenAndServe()
			if err != nil {
				fmt.Fprintf(os.Stderr, "error listening sntp server: %v\n", err)
				return
			}
		}()
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
	decoder := presentation.NewDecoder(binary.LittleEndian, trace.Logger)
	encoder := presentation.NewEncoder(binary.LittleEndian, trace.Logger)

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

	stateOrdersDecoder := order.NewDecoder(binary.LittleEndian)
	stateOrdersDecoder.SetActionId(abstraction.PacketId(info.MessageIds.AddStateOrder), stateOrdersDecoder.DecodeAdd)
	stateOrdersDecoder.SetActionId(abstraction.PacketId(info.MessageIds.RemoveStateOrder), stateOrdersDecoder.DecodeRemove)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.AddStateOrder), stateOrdersDecoder)
	decoder.SetPacketDecoder(abstraction.PacketId(info.MessageIds.RemoveStateOrder), stateOrdersDecoder)

	protectionDecoder := protection.NewDecoder(binary.LittleEndian)
	protectionDecoder.SetSeverity(1000, protection.FaultSeverity).SetSeverity(2000, protection.WarningSeverity).SetSeverity(3000, protection.OkSeverity)
	protectionDecoder.SetSeverity(1111, protection.FaultSeverity).SetSeverity(2111, protection.WarningSeverity).SetSeverity(3111, protection.OkSeverity)
	protectionDecoder.SetSeverity(1222, protection.FaultSeverity).SetSeverity(2222, protection.WarningSeverity).SetSeverity(3222, protection.OkSeverity)
	protectionDecoder.SetSeverity(1333, protection.FaultSeverity)
	protectionDecoder.SetSeverity(1444, protection.FaultSeverity)
	protectionDecoder.SetSeverity(1555, protection.FaultSeverity).SetSeverity(2555, protection.WarningSeverity)
	protectionDecoder.SetSeverity(1666, protection.FaultSeverity).SetSeverity(2666, protection.WarningSeverity).SetSeverity(3666, protection.OkSeverity)
	decoder.SetPacketDecoder(1000, protectionDecoder)
	decoder.SetPacketDecoder(1111, protectionDecoder)
	decoder.SetPacketDecoder(1222, protectionDecoder)
	decoder.SetPacketDecoder(1333, protectionDecoder)
	decoder.SetPacketDecoder(1444, protectionDecoder)
	decoder.SetPacketDecoder(1555, protectionDecoder)
	decoder.SetPacketDecoder(1666, protectionDecoder)
	decoder.SetPacketDecoder(2000, protectionDecoder)
	decoder.SetPacketDecoder(2111, protectionDecoder)
	decoder.SetPacketDecoder(2222, protectionDecoder)
	decoder.SetPacketDecoder(2555, protectionDecoder)
	decoder.SetPacketDecoder(2666, protectionDecoder)
	decoder.SetPacketDecoder(3000, protectionDecoder)
	decoder.SetPacketDecoder(3111, protectionDecoder)
	decoder.SetPacketDecoder(3222, protectionDecoder)
	decoder.SetPacketDecoder(3666, protectionDecoder)

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

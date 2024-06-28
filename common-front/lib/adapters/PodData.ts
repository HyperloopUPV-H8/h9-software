import {
    PodData,
    Board,
    Packet,
    BooleanMeasurement,
    EnumMeasurement,
    Measurement,
    NumericMeasurement,
} from '../models';

import { NumericType, isNumericType } from '../BackendTypes';

export type PodDataAdapter = { boards: { [name: string]: BoardAdapter } };

type BoardAdapter = Omit<Board, 'measurementToPacket' | 'packets'> & {
    packets: { [id: number]: PacketAdapter };
};

export type PacketAdapter = Omit<Packet, 'measurements'> & {
    measurements: { [name: string]: MeasurementAdapter };
};

export type MeasurementAdapter =
    | NumericMeasurementAdapter
    | BooleanMeasurementAdapter
    | EnumMeasurementAdapter;

export type NumericMeasurementAdapter = Omit<NumericMeasurement, 'value'>;
export type BooleanMeasurementAdapter = Omit<BooleanMeasurement, 'value'>;
export type EnumMeasurementAdapter = { options: string[] } & Omit<
    EnumMeasurement,
    'value'
>;

export function createPodDataFromAdapter(adapter: PodDataAdapter): PodData {
    const boards: Board[] = Object.values(adapter.boards).map(
        (boardAdapter) => {
            const packets = getPackets(boardAdapter.name, boardAdapter.packets);
            const measurementToPacket = getMeasurementToPacket(
                boardAdapter.packets
            );

            return {
                name: boardAdapter.name,
                packets,
                measurementToPacket,
            };
        }
    );

    const packetToBoard = getPacketToBoard(adapter.boards);

    return { boards, packetToBoard, lastUpdates: {} };
}

export function getPackets(
    boardName: string,
    packets: Record<string, PacketAdapter>
): Packet[] {
    return Object.values(packets).map((packetAdapter) => {
        return {
            ...packetAdapter,
            measurements: getMeasurements(
                boardName,
                packetAdapter.measurements
            ),
        };
    });
}

function getMeasurements(
    boardName: string,
    adapters: Record<string, MeasurementAdapter>
): Measurement[] {
    return Object.values(adapters).map((adapter) => {
        const id = `${boardName}/${adapter.id}`;
        if (isNumericAdapter(adapter)) {
            return getNumericMeasurement(id, adapter);
        } else if (adapter.type == 'enum') {
            return getEnumMeasurement(id, adapter);
        } else {
            return getBooleanMeasurement(id, adapter);
        }
        // } else {
        //     return getArrayMeasurement(adapter);
        // }
    });
}

export function isNumericAdapter(
    adapter: MeasurementAdapter
): adapter is NumericMeasurementAdapter {
    return isNumericType(adapter.type);
}

export function getNumericMeasurement(
    id: string,
    adapter: NumericMeasurementAdapter
): NumericMeasurement {
    return {
        id: id,
        name: adapter.name,
        type: adapter.type as NumericType,
        value: {
            average: 0,
            last: 0,
            showLatest: false,
        },
        units: adapter.units,
        safeRange: adapter.safeRange,
        warningRange: adapter.warningRange,
    };
}

export function getEnumMeasurement(
    id: string,
    adapter: EnumMeasurementAdapter
): EnumMeasurement {
    return {
        id: id,
        name: adapter.name,
        type: 'enum',
        value: adapter.options[0],
    };
}

export function getBooleanMeasurement(
    id: string,
    adapter: BooleanMeasurementAdapter
): BooleanMeasurement {
    return {
        id: id,
        name: adapter.name,
        type: adapter.type as 'bool',
        value: false,
    };
}

// export function getArrayMeasurement(
//     adapter: ArrayMeasurementAdapter
// ): ArrayMeasurement {
//     return {
//         id: adapter.id,
//         name: adapter.name,
//         type: "array",
//         itemType: adapter.itemType,
//         value: [],
//     };
// }

export function getPacketToBoard(
    boards: Record<string, BoardAdapter>
): Record<number, number> {
    let packetToBoard: PodData['packetToBoard'] = {};

    Object.values(boards).forEach((board, index) => {
        Object.values(board.packets).forEach((packet) => {
            packetToBoard[packet.id] = index;
        });
    });

    return packetToBoard;
}

export function getMeasurementToPacket(
    packets: Record<string, PacketAdapter>
): Record<string, number> {
    let measurementToPacket: Board['measurementToPacket'] = {};

    Object.values(packets).forEach((packet) => {
        Object.values(packet.measurements).forEach(
            (m) => (measurementToPacket[m.id] = packet.id)
        );
    });

    return measurementToPacket;
}

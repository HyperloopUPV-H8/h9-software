import {
    EnumMeasurement,
    Measurement,
    ObccuMeasurements,
    VcuMeasurements,
    clamp,
    clampAndNormalize,
    isNumericMeasurement,
} from 'common';

export type State = 'stable' | 'warning' | 'fault' | 'ignore';

export const stateToColor = {
    stable: '#ACF293',
    warning: '#F4F688',
    fault: '#EF9A87',
    ignore: '#EDF6FE',
};

export const stateToColorBackground = {
    stable: '#E6FFDD',
    warning: '#FCFFDD',
    fault: '#FFE5DD',
    ignore: '#EDF6FE',
};

const enumStates: { [meas_id: string]: { [enum_variant: string]: State } } = {
    [VcuMeasurements.valveState]: {
        OPEN: 'warning',
    },
    [VcuMeasurements.pcuConnection]: {
        PCU_Connected: 'stable',
    },
    [VcuMeasurements.obccuConnection]: {
        OBCCU_Connected: 'stable',
    },
    [VcuMeasurements.lcuConnection]: {
        LCU_Connected: 'stable',
    },
    [ObccuMeasurements.contactorsState]: {
        OPEN: 'stable',
        PRECHARGE: 'warning',
        CLOSED: 'warning',
    },
    [ObccuMeasurements.imdState]: {
        DEVICE_ERROR: 'fault',
        ISOLATED: 'stable',
        UNKNOWN: 'warning',
        DRIFT: 'fault',
        EARTH_FAULT: 'fault',
        SHORT_CIRCUIT: 'fault',
    },
};

export function getState(meas: Measurement): State {
    if (isNumericMeasurement(meas)) {
        return getStateFromRange(
            meas.value.last,
            meas.safeRange[0],
            meas.safeRange[1],
            meas.warningRange[0],
            meas.warningRange[1]
        );
    } else if (meas.type == 'bool') {
        return meas.value ? 'stable' : 'fault';
    } else {
        if (
            enumStates[meas.id] != undefined &&
            enumStates[meas.id][meas.value] != undefined
        ) {
            return enumStates[meas.id][meas.value];
        }
        return 'ignore';
    }
}

export function getStateFromEnum(_: EnumMeasurement): State {
    return 'stable';
}

export function getStateFromRange(
    value: number,
    safeMin: number | null,
    safeMax: number | null,
    warningMin: number | null,
    warningMax: number | null
): State {
    if (warningMin !== null && value < warningMin) {
        return 'fault';
    }

    if (safeMin !== null && value < safeMin) {
        return 'warning';
    }

    if (warningMax !== null && value > warningMax) {
        return 'fault';
    }

    if (safeMax !== null && value > safeMax) {
        return 'warning';
    }

    return 'stable';
}

export function getPercentageFromRange(
    value: number,
    min: number,
    max: number
): number {
    const normValue = Math.max(Math.min(value, max), min);
    return ((normValue - min) / (max - min)) * 100;
}

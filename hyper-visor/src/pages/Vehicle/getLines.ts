import { LineDescription, Measurements, NumericMeasurement, isNumericMeasurement } from "common";

export function getLines(measurements: Measurements, ids: string[]): LineDescription[] {
    return ids.flatMap((id) => {
        const meas = measurements[id];

        if (!meas || !isNumericMeasurement(meas)) {
            return [];
        }

        return [
            {
                id: id,
                name: meas.name,
                color: "red",
                getUpdate: () => getMeasurementUpdate(meas),
                range: meas.safeRange,
            },
        ];
    });
}

function getMeasurementUpdate(measurement: NumericMeasurement): number {

    if (!measurement) {
        console.error(`measurement ${measurement} not found`);
        return 0;
    }

    if (isNumericMeasurement(measurement)) {
        return measurement.value.last;
    } else {
        console.error(`measurement ${measurement} is not numeric`);
        return 0;
    }
}

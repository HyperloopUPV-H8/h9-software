import { LineDescription, isNumericMeasurement } from "common";
import { store } from "store";

export function getLines(ids: string[]): LineDescription[] {
    return ids.flatMap((id) => {
        const measurements = store.getState().measurements;

        const meas = measurements.measurements[id];

        if (!meas || !isNumericMeasurement(meas)) {
            return [];
        }

        return [
            {
                id: id,
                name: meas.name,
                color: "red",
                getUpdate: () => getMeasurementUpdate(id),
                range: meas.safeRange,
            },
        ];
    });
}

function getMeasurementUpdate(id: string): number {
    const measurement = store.getState().measurements.measurements[id];

    if (!measurement) {
        console.error(`measurement ${id} not found`);
        return 0;
    }

    if (isNumericMeasurement(measurement)) {
        return measurement.value.last;
    } else {
        console.error(`measurement ${id} is not numeric`);
        return 0;
    }
}

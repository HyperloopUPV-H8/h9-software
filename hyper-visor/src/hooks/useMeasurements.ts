import { useInterval, useMeasurementsStore, useSubscribe } from "common";
import { useState } from "react";

export function useMeasurements() {
    
    const measurementsStore = useMeasurementsStore((state) => state.measurements);
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements)

    useSubscribe("podData/update", (update) => {
        updateMeasurements(update)
    });

    const [measurements, setMeasurements] = useState(
        measurementsStore
    );

    useInterval(() => {
        setMeasurements(useMeasurementsStore((state) => state.measurements));
    }, 1000 / 30);

    return measurements;
}

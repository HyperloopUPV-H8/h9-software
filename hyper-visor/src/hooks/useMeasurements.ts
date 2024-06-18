import { useInterval, useSubscribe } from "common";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMeasurements } from "slices/measurementsSlice";
import { store } from "store";

export function useMeasurements() {
    const dispatch = useDispatch();

    useSubscribe("podData/update", (update) => {
        dispatch(updateMeasurements(update));
    });

    const [measurements, setMeasurements] = useState(
        store.getState().measurements
    );

    useInterval(() => {
        setMeasurements(store.getState().measurements);
    }, 1000 / 30);

    return measurements;
}

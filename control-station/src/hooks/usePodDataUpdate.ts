import { useMeasurementsStore, usePodDataStore, useSubscribe } from 'common';

export function usePodDataUpdate() {
    const updatePodData = usePodDataStore((state) => state.updatePodData);
    const updateMeasurements = useMeasurementsStore(
        (state) => state.updateMeasurements
    );

    useSubscribe('podData/update', (update) => {
        updatePodData(update);
        updateMeasurements(update);
    });
}

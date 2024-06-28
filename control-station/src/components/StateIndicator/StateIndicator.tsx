import { useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './StateIndicator.module.scss';
import { State, getState, stateToColor } from 'state';
import { ReactNode, memo, useEffect, useRef, useState } from 'react';

interface Props {
    measurementId: string;
    icon: string;
}

export const StateIndicator = memo(({ measurementId, icon }: Props) => {
    const [measurement, measurementInfo] = useMeasurementsStore((state) => [
        state.getMeasurement(measurementId),
        state.getEnumMeasurementInfo(measurementId),
    ]);

    const state = useRef<State>(getState(measurement));

    const [variant, setVariant] = useState(measurementInfo.getUpdate());

    useGlobalTicker(() => {
        setVariant(measurementInfo.getUpdate());
    });

    useEffect(() => {
        state.current = getState(measurement);
    });

    return (
        <div
            className={styles.state_indicator}
            style={{ backgroundColor: stateToColor[state.current] }}
        >
            <img className={styles.icon} src={icon} alt="State icon" />

            <p className={styles.title}>{variant}</p>

            <img className={styles.icon} src={icon} alt="State icon" />
        </div>
    );
});

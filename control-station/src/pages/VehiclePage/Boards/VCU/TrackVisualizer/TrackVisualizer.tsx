import styles from './TrackVisualizer.module.scss';
import vehicleTrack from 'assets/svg/vehicle-track.svg';
import vehicle from 'assets/svg/vesper-icon.svg';
import { useGlobalTicker } from 'common';
import { memo, useEffect, useRef, useState } from 'react';
import { getPercentageFromRange } from 'state';

type Props = {
    getUpdate: () => number;
    rangeMin: number;
    rangeMax: number;
};

export const TrackVisualizer = memo((props: Props) => {
    const [valueState, setValueState] = useState<number>(0);
    const percentage = useRef<number>(100);

    useGlobalTicker(() => {
        setValueState(props.getUpdate());
    });

    useEffect(() => {
        percentage.current =
            100 -
            getPercentageFromRange(valueState, props.rangeMin, props.rangeMax);
    });

    return (
        <div className={styles.container}>
            <div className={styles.track_container}>
                <img src={vehicleTrack} alt="Vehicle Track" />
            </div>
            <div
                className={styles.vehicle_container}
                style={{
                    top: percentage.current + '%',
                }}
            >
                <img src={vehicle} alt="Vehicle" />
            </div>
        </div>
    );
});

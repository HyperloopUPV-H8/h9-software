import { NumericMeasurementInfo, useGlobalTicker } from 'common';
import styles from './HEMSRepresentation.module.scss';
import HEMSWall from '../../../assets/svg/HEMS-wall.svg';
import HEMS from '../../../assets/svg/HEMS.svg';
import { useEffect, useRef, useState } from 'react';
import { getPercentageFromRange } from 'state';

type Props = {
    getUpdate: () => number;
    rangeMin: number;
    rangeMax: number;
};

export default function HEMSRepresentation(props: Props) {
    const [valueState, setValueState] = useState<number>(0);
    const percentage = useRef<number>(100);

    useGlobalTicker(() => {
        setValueState(props.getUpdate());
    });

    useEffect(() => {
        percentage.current = getPercentageFromRange(
            valueState,
            props.rangeMin,
            props.rangeMax
        );
    });

    return (
        <div className={styles.container}>
            <div className={styles.wall}>
                <img src={HEMSWall} alt="wall" />
            </div>

            <div className={styles.unit}>
                <img
                    src={HEMS}
                    alt="hems"
                    style={{
                        top: percentage.current + '%',
                    }}
                />
            </div>
        </div>
    );
}

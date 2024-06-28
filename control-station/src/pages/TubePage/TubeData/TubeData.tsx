import { PumpIndicator } from './PumpIndicator/PumpIndicator';
import styles from './TubeData.module.scss';
import { NumericMeasurement } from 'common';

const defaultMeasurement: NumericMeasurement = {
    id: 'test',
    name: 'test',
    safeRange: [0, 100],
    type: 'int16',
    units: 'A',
    value: { average: 10, last: 12, showLatest: true },
    warningRange: [0, 100],
};

const GAUGE_WIDTH = 130;

export const TubeData = () => {
    return (
        <div className={styles.tubeDataWrapper}>
            <PumpIndicator isOn={true} />
        </div>
    );
};

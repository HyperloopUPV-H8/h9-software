import { NumericMeasurement } from "common";
import styles from "./DoubleGauge.module.scss";
import { GaugeTag } from "components/GaugeTag/GaugeTag";

type Props = {
    firstGauge: NumericMeasurement;
    secondGauge: NumericMeasurement;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

export const DoubleGauge = ({ firstGauge, secondGauge }: Props) => {
    return (
        <div className={styles.doubleGauge}>
            <GaugeTag
                className=""
                min={firstGauge.safeRange[0] ?? DEFAULT_MIN}
                max={firstGauge.safeRange[1] ?? DEFAULT_MAX}
                strokeWidth={150}
                measurement={firstGauge}
            />
            <GaugeTag
                className=""
                min={secondGauge.safeRange[0] ?? DEFAULT_MIN}
                max={secondGauge.safeRange[1] ?? DEFAULT_MAX}
                strokeWidth={150}
                measurement={secondGauge}
            />
        </div>
    );
};

import styles from "./Value.module.scss";
import { Measurement, isNumericMeasurement } from "common";

type Props = {
    measurement: Measurement;
};

export const Value = ({ measurement }: Props) => {
    if (isNumericMeasurement(measurement)) {
        return (
            <span className={styles.value}>
                {measurement.value.average.toFixed(2)} {measurement.units}
            </span>
        );
    } else {
        return (
            <span className={styles.value}>{measurement.value.toString()}</span>
        );
    }
};

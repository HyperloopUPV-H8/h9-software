import styles from "components/ValueData/ValueData.module.scss";
import { Value } from "components/ValueData/Value/Value";
import { Measurement } from "common";

type Props = {
    measurement: Measurement;
};

export const ValueData = ({ measurement }: Props) => {
    return (
        <div className={styles.valueDataWrapper}>
            <span className={styles.name}>{measurement.name}</span>
            <Value measurement={measurement} />
        </div>
    );
};

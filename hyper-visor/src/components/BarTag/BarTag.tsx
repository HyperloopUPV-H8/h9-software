import styles from "./BarTag.module.scss";
import { NumericMeasurement } from "common";
import { Bar, BarType } from "./Bar/Bar";
import { ValueData } from "components/ValueData/ValueData";

type Props = {
    measurement: NumericMeasurement;
    barType: BarType;
    showWrapper?: boolean;
};

export const BarTag = ({
    measurement,
    barType,
    showWrapper = false,
}: Props) => {
    return (
        <article
            className={`${styles.barTagWrapper} ${
                showWrapper ? "tagWrapper" : ""
            }`}
        >
            <Bar
                type={barType}
                value={measurement.value.average}
                max={100}
                min={0}
            />
            <ValueData measurement={measurement} />
        </article>
    );
};

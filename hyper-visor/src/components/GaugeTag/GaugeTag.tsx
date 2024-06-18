import styles from "components/GaugeTag/GaugeTag.module.scss";
import { Gauge } from "components/GaugeTag/Gauge/Gauge";
import { NumericMeasurement } from "common";
import { TextData } from "./TextData/TextData";

type Props = {
    measurement: NumericMeasurement;
    className: string;
    strokeWidth: number;
    min: number;
    max: number;
};
export const GaugeTag = ({
    measurement,
    className,
    strokeWidth,
    min,
    max,
}: Props) => {
    return (
        <article className={`${styles.gaugeTagWrapper} ${className}`}>
            <Gauge
                className={styles.gauge}
                sweep={250}
                strokeWidth={strokeWidth}
                value={measurement.value.average}
                min={min}
                max={max}
            />
            <TextData
                name={measurement.name}
                units={measurement.units}
                value={measurement.value.average}
            ></TextData>
        </article>
    );
};

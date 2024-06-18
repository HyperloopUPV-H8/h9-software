import styles from "./BarTag.module.scss";
import { NumericMeasurementInfo } from "common";
import { BarType } from "./Bar/Bar";
import { ValueData } from "components/ValueData/ValueData";

type Props = {
    measurement: NumericMeasurementInfo;
    barType: BarType;
    showWrapper?: boolean;
};

export const BarTag = ({
    measurement,
    showWrapper = false,
}: Props) => {

    return (
        <article
            className={`${styles.barTagWrapper} ${
                showWrapper ? "tagWrapper" : ""
            }`}
        >
            {/* <Bar
                type={barType}
                value={}
                max={100}
                min={0}
            /> */}
            <ValueData
                name={measurement.name}
                getUpdate={measurement.getUpdate}
                units={measurement.units} 
            />
        </article>
    );
};

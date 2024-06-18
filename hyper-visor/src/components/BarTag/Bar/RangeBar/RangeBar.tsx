import styles from "./RangeBar.module.scss";
import { clampAndNormalize } from "math";
type Props = {
    type: "range" | "temp";
    value: number;
    min: number;
    max: number;
};

export const RangeBar = ({ type, value, min, max }: Props) => {
    const oppositeHeight = (1 - clampAndNormalize(value, min, max)) * 100;
    return (
        <div
            className={`${styles.wrapper} ${
                type == "temp" ? styles.tempWrapper : ""
            }`}
        >
            <div
                className={`barWrapper ${styles.rangeBarWrapper} ${
                    type == "range" ? styles.range : styles.temp
                }`}
            >
                <div
                    className={styles.content}
                    style={{
                        height: `${oppositeHeight}%`,
                    }}
                ></div>
            </div>
            {type == "temp" && <div className={styles.bulb}></div>}
        </div>
    );
};

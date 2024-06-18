import styles from "./TextData.module.scss";
import { memo } from "react";

type Props = {
    name: string;
    value: number;
    units: string;
};

export const TextData = memo(({ name, value, units }: Props) => {
    return (
        <div className={styles.textData}>
            <div className={styles.name}>{name}</div>
            <div className={styles.value}>{value.toFixed(2)}</div>
            <div className={styles.units}>{units}</div>
        </div>
    );
});

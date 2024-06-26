import { useState } from "react";
import styles from "./Value.module.scss";
import { useGlobalTicker } from "common";

type Props = {
    getUpdate: () => number,
    units: string
};

export const Value = ({ getUpdate, units }: Props) => {

    const [value, setValue] = useState(getUpdate());

    useGlobalTicker(() => {
        setValue(getUpdate());
    })

    return (
        <span className={styles.value}>
            {value.toFixed(2)} {units}
        </span>
    );
};

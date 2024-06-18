import { AnimatedFan } from "common";
import styles from "./Pump.module.scss";

type Props = {
    on: boolean;
};

export const Pump = ({ on }: Props) => {
    return (
        <div className={styles.pump}>
            <div>
                {" "}
                Pump is{" "}
                <span className={styles.state}>{on ? "ON" : "OFF"}</span>
            </div>
            <AnimatedFan
                className={styles.fanIcon}
                rotate={on}
            />
        </div>
    );
};

import styles from "./Propulsion.module.scss";
import { Title } from "components/Title/Title";
import { Text } from "components/Text/Text";
import { ColorfulChart, selectPcuMeasurements } from "common";
import { DoubleGauge } from "components/DoubleGauge/DoubleGauge";
import { useMemo } from "react";
import { useMeasurements } from "hooks/useMeasurements";
import { getLines } from "../getLines";

export const Propulsion = () => {
    const measurements = useMeasurements();
    const propulData = useMemo(
        () => selectPcuMeasurements(measurements),
        [measurements]
    );

    return (
        <div className={styles.propulsion}>
            <Title title="Propulsion ON" />
            <DoubleGauge
                firstGauge={propulData.velocity}
                secondGauge={propulData.accel}
            />
            <Text text="These are the currents inside the vehicle's motor. Together, they propulse Kénos." />
            <ColorfulChart
                className={styles.chart}
                title="Motor 1"
                length={100}
                items={getLines([
                    propulData.motor_a_current_u.id,
                    propulData.motor_a_current_v.id,
                    propulData.motor_a_current_w.id,
                ])}
            ></ColorfulChart>
            <ColorfulChart
                className={styles.chart}
                title="Motor 2"
                length={100}
                items={getLines([
                    propulData.motor_b_current_u.id,
                    propulData.motor_b_current_v.id,
                    propulData.motor_b_current_w.id,
                ])}
            ></ColorfulChart>
        </div>
    );
};

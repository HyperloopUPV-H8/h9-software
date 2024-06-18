import { ColorfulChart, LcuMeasurements, useMeasurementsStore } from "common";
import { HEMS } from "./HEMS/HEMS";
import styles from "./Levitation.module.scss";
import { getLines } from "../getLines";

export const Levitation = () => {
    const measurements = useMeasurementsStore((state) => state.measurements);
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const airgap1 = getNumericMeasurementInfo(LcuMeasurements.airgap1);

    return (
        <div className={styles.levitation}>
            <HEMS
                m1={airgap1}
                // m2={levData.airgap_2}
                // m3={levData.airgap_3}
                // m4={levData.airgap_4}
            />
            <ColorfulChart
                title="HEMS currents"
                items={getLines(measurements, [
                    "LCU_MASTER/lcu_master_current_coil_hems_1",
                    "LCU_SLAVE/lcu_slave_real_coil_current_hems_2",
                    "LCU_MASTER/lcu_master_current_coil_hems_3",
                    "LCU_SLAVE/lcu_slave_real_coil_current_hems_4",
                ])}
                length={100}
            />
            {/* <EMS
                m1={levData.slave_airgap_5}
                m2={levData.slave_airgap_6}
                m3={levData.slave_airgap_7}
                m4={levData.slave_airgap_8}
            /> */}
            <ColorfulChart
                title="EMS currents"
                items={getLines(measurements, [
                    "LCU_MASTER/lcu_master_current_coil_ems_1",
                    "LCU_SLAVE/lcu_slave_real_coil_current_ems_2",
                    "LCU_MASTER/lcu_master_current_coil_ems_3",
                    "LCU_SLAVE/lcu_slave_real_coil_current_ems_4",
                ])}
                length={100}
            />
        </div>
    );
};

import { ColorfulChart, LcuMeasurements, useMeasurementsStore } from "common";
import { HEMS } from "./HEMS/HEMS";
import styles from "./Levitation.module.scss";
import { getLines } from "../getLines";
import { EMS } from "./EMS/EMS";

export const Levitation = () => {
    const measurements = useMeasurementsStore((state) => state.measurements);
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const airgap1 = getNumericMeasurementInfo(LcuMeasurements.airgap1);
    const airgap2 = getNumericMeasurementInfo(LcuMeasurements.airgap2);
    const airgap3 = getNumericMeasurementInfo(LcuMeasurements.airgap3);
    const airgap4 = getNumericMeasurementInfo(LcuMeasurements.airgap4);
    const airgap5 = getNumericMeasurementInfo(LcuMeasurements.airgap5);
    const airgap6 = getNumericMeasurementInfo(LcuMeasurements.airgap6);
    const airgap7 = getNumericMeasurementInfo(LcuMeasurements.airgap7);
    const airgap8 = getNumericMeasurementInfo(LcuMeasurements.airgap8);
    

    return (
        <div className={styles.levitation}>
            <HEMS
                m1={airgap1}
                m2={airgap2}
                m3={airgap3}
                m4={airgap4}
            />
            <ColorfulChart
                title="HEMS currents"
                items={getLines(measurements, [
                    "LCU/lcu_coil_current_ref_1",
                    "LCU/lcu_coil_current_ref_2",
                    "LCU/lcu_coil_current_ref_3",
                    "LCU/lcu_coil_current_ref_4",
                ])}
                length={100}
            />
            <EMS
                m1={airgap5}
                m2={airgap6}
                m3={airgap7}
                m4={airgap8}
            />
            <ColorfulChart
                title="EMS currents"
                items={getLines(measurements, [
                    "LCU/lcu_coil_current_ref_5",
                    "LCU/lcu_coil_current_ref_6",
                    "LCU/lcu_coil_current_ref_7",
                    "LCU/lcu_coil_current_ref_8",
                ])}
                length={100}
            />
        </div>
    );
};

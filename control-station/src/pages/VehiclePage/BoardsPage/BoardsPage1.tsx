import styles from "./BoardsPage.module.scss";
import { OBCCUBatteries } from "../Boards/OBCCU/OBCCUBatteries";
import {
    useMeasurementsStore,
    useSubscribe,
} from "common";
import { OBCCUGeneralInfo } from "../Boards/OBCCU/OBCCUGeneralInfo";
import { BMSL } from "../Boards/BMSL/BMSL";
import { VCUPositionInfo } from "../Boards/VCU/VCUPositionInfo";
import { VCUBrakesInfo } from "../Boards/VCU/VCUBrakesInfo";

export const BoardsPage1 = () => {
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements);

    useSubscribe("podData/update", (msg) => {
        updateMeasurements(msg);
    });

    return (
        <div className={styles.boardsPage}>
            <OBCCUBatteries />
            <div className={styles.column}>
                <OBCCUGeneralInfo />
                <BMSL />
            </div>
            <VCUPositionInfo />
            <VCUBrakesInfo />
        </div>
    );
};

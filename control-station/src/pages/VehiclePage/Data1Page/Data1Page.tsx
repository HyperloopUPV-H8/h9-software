import styles from './Data1Page.module.scss';
import { OBCCUBatteries } from '../Boards/OBCCU/OBCCUBatteries';
import { OBCCUGeneralInfo } from '../Boards/OBCCU/OBCCUGeneralInfo';
import { VCUBrakesInfo } from '../Boards/VCU/VCUBrakesInfo';
import { VCUPositionInfo } from '../Boards/VCU/VCUPositionInfo';
import { VCUConnectionsInfo } from '../Boards/VCU/VCUConnectionsInfo';

export const Data1Page = () => {
    return (
        <div className={styles.data1_page}>
            <div className={styles.column}>
                <OBCCUBatteries />
            </div>

            <div className={styles.column}>
                <OBCCUGeneralInfo />
            </div>

            <div className={styles.column}>
                <VCUPositionInfo />
            </div>

            <div className={styles.column}>
                <VCUBrakesInfo />
                <VCUConnectionsInfo />
            </div>
        </div>
    );
};

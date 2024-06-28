import { Window } from 'components/Window/Window';
import styles from './OBCCU.module.scss';
import { ObccuMeasurements } from 'common';
import { BatteryPack } from 'pages/VehiclePage/Boards/OBCCU/BatteryPack/BatteryPack';
import { ReactComponent as XT90 } from '../../../../assets/svg/XT90.svg';

export const OBCCUBatteries = () => {
    return (
        <Window title="OBCCU">
            <div className={styles.hv_battery}>
                <div className={styles.column}>
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge1
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature1
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell1}
                        minCellMeasurementId={ObccuMeasurements.minimumCell1}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage1}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing1
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge2
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature2
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell2}
                        minCellMeasurementId={ObccuMeasurements.minimumCell2}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage2}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing2
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge3
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature3
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell3}
                        minCellMeasurementId={ObccuMeasurements.minimumCell3}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage3}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing3
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge4
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature4
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell4}
                        minCellMeasurementId={ObccuMeasurements.minimumCell4}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage4}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing4
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge5
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature5
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell5}
                        minCellMeasurementId={ObccuMeasurements.minimumCell5}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage5}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing5
                        }
                    />
                </div>
                <div className={styles.middle_piece}>
                    <p className={`${styles.cell_legend} ${styles.one}`}>1</p>
                    <p className={`${styles.cell_legend} ${styles.ten}`}>10</p>

                    <div className={styles.connector_row}>
                        <XT90 className={styles.xt90} />
                        <XT90 className={styles.xt90} />
                    </div>
                    <div className={styles.connector_row}>
                        <XT90 className={styles.xt90} />
                        <XT90 className={styles.xt90} />
                    </div>
                    <div className={styles.connector_row}>
                        <XT90 className={styles.xt90} />
                        <XT90 className={styles.xt90} />
                    </div>
                    <div className={styles.connector_row}>
                        <XT90 className={styles.xt90} />
                        <XT90 className={styles.xt90} />
                    </div>
                    <div className={styles.connector_row}>
                        <XT90 className={styles.xt90} />
                        <XT90 className={styles.xt90} />
                    </div>

                    <p className={`${styles.cell_legend} ${styles.five}`}>5</p>
                    <p className={`${styles.cell_legend} ${styles.six}`}>6</p>
                </div>
                <div className={styles.column}>
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge10
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature10
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell10}
                        minCellMeasurementId={ObccuMeasurements.minimumCell10}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage10}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing10
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge9
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature9
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell9}
                        minCellMeasurementId={ObccuMeasurements.minimumCell9}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage9}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing9
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge8
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature8
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell8}
                        minCellMeasurementId={ObccuMeasurements.minimumCell8}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage8}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing8
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge7
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature7
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell7}
                        minCellMeasurementId={ObccuMeasurements.minimumCell7}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage7}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing7
                        }
                    />
                    <BatteryPack
                        stateOfChargeMeasurementId={
                            ObccuMeasurements.stateOfCharge6
                        }
                        temperatureMeasurementId={
                            ObccuMeasurements.batteryTemperature6
                        }
                        maxCellMeasurementId={ObccuMeasurements.maximumCell6}
                        minCellMeasurementId={ObccuMeasurements.minimumCell6}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage6}
                        isBalancingMeasurementId={
                            ObccuMeasurements.isBalancing6
                        }
                    />
                </div>
            </div>
        </Window>
    );
};

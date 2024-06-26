import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { useMeasurementsStore, VcuMeasurements } from "common";
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack";
import { BarIndicator } from "components/BarIndicator/BarIndicator";
import thermometerIcon from "assets/svg/thermometer-filled.svg";
import { BrakeVisualizer } from "components/BrakeVisualizer/BrakeVisualizer";

export const VCUBrakesInfo = () => {

    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);
    const getBooleanMeasurementInfo = useMeasurementsStore(state => state.getBooleanMeasurementInfo);
    const reed1 = getBooleanMeasurementInfo(VcuMeasurements.reed1);
    const reed2 = getBooleanMeasurementInfo(VcuMeasurements.reed2);
    const reed3 = getBooleanMeasurementInfo(VcuMeasurements.reed2);
    const reed4 = getBooleanMeasurementInfo(VcuMeasurements.reed2);
    const bottleTemp1 = getNumericMeasurementInfo(VcuMeasurements.bottleTemp1);
    const bottleTemp2 = getNumericMeasurementInfo(VcuMeasurements.bottleTemp2);
    const highPressure = getNumericMeasurementInfo(VcuMeasurements.highPressure);

    return (
        <Window title="VCU">
            <div className={styles.vcuBrakesInfo}>

                <div className={styles.brakesContainer}>
                    <div className={styles.brakesColumn}>
                        <BrakeVisualizer getStatus={reed1.getUpdate} rotation="left" />
                        <BrakeVisualizer getStatus={reed2.getUpdate} rotation="left" />
                    </div>
                    <div className={styles.brakesColumn}>
                        <BrakeVisualizer getStatus={reed3.getUpdate} rotation="right" />
                        <BrakeVisualizer getStatus={reed4.getUpdate} rotation="right" />
                    </div>
                </div>

                <IndicatorStack>
                    <BarIndicator
                        title="Bottle Temp"
                        icon={thermometerIcon}
                        getValue={bottleTemp1.getUpdate}
                        safeRangeMin={bottleTemp1.range[0]!!}
                        safeRangeMax={bottleTemp1.range[1]!!}
                        units="ºC"
                    />
                    <BarIndicator
                        title="Bottle Temp"
                        icon={thermometerIcon}
                        getValue={bottleTemp2.getUpdate}
                        safeRangeMin={bottleTemp2.range[0]!!}
                        safeRangeMax={bottleTemp2.range[1]!!}
                        units="ºC"
                    />
                </IndicatorStack>

                <IndicatorStack>
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};

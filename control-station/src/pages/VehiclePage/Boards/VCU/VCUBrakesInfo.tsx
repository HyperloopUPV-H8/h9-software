import styles from './VCU.module.scss';
import { Window } from 'components/Window/Window';
import { useMeasurementsStore, VcuMeasurements } from 'common';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import pressureIcon from 'assets/svg/pressure-filled.svg';
import { BrakeVisualizer } from 'components/BrakeVisualizer/BrakeVisualizer';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';

export const VCUBrakesInfo = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );
    const getEnumMeasurementInfo = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo
    );
    const reed1 = getEnumMeasurementInfo(VcuMeasurements.reed1);
    const reed2 = getEnumMeasurementInfo(VcuMeasurements.reed2);
    const reed3 = getEnumMeasurementInfo(VcuMeasurements.reed3);
    const reed4 = getEnumMeasurementInfo(VcuMeasurements.reed4);
    const highPressure = getNumericMeasurementInfo(
        VcuMeasurements.highPressure
    );
    const lowPressure1 = getNumericMeasurementInfo(
        VcuMeasurements.lowPressure1
    );
    const lowPressure2 = getNumericMeasurementInfo(
        VcuMeasurements.lowPressure2
    );
    const referencePressure = getNumericMeasurementInfo(
        VcuMeasurements.referencePressure
    );

    return (
        <Window title="VCU">
            <div className={styles.vcuBrakesInfo}>
                <div className={styles.brakesContainer}>
                    <div className={styles.brakesColumn}>
                        <BrakeVisualizer
                            getStatus={reed1.getUpdate}
                            rotation="left"
                        />
                        <BrakeVisualizer
                            getStatus={reed2.getUpdate}
                            rotation="left"
                        />
                    </div>
                    <div className={styles.brakesColumn}>
                        <BrakeVisualizer
                            getStatus={reed3.getUpdate}
                            rotation="right"
                        />
                        <BrakeVisualizer
                            getStatus={reed4.getUpdate}
                            rotation="right"
                        />
                    </div>
                </div>

                {/* <IndicatorStack>
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
                </IndicatorStack> */}

                <IndicatorStack>
                    <BarIndicator
                        title="High Pressure"
                        icon={pressureIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        warningRangeMin={highPressure.warningRange[0]!!}
                        warningRangeMax={highPressure.warningRange[1]!!}
                        units="bar"
                    />
                    <StateIndicator
                        measurementId={VcuMeasurements.valveState}
                        icon={pressureIcon}
                    />
                    <BarIndicator
                        title="Reference Pressure"
                        icon={pressureIcon}
                        getValue={referencePressure.getUpdate}
                        safeRangeMin={referencePressure.range[0]!!}
                        safeRangeMax={referencePressure.range[1]!!}
                        warningRangeMin={referencePressure.warningRange[0]!!}
                        warningRangeMax={referencePressure.warningRange[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="Low Pressure 1"
                        icon={pressureIcon}
                        getValue={lowPressure1.getUpdate}
                        safeRangeMin={lowPressure1.range[0]!!}
                        safeRangeMax={lowPressure1.range[1]!!}
                        warningRangeMin={lowPressure1.warningRange[0]!!}
                        warningRangeMax={lowPressure1.warningRange[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="Low Pressure 2"
                        icon={pressureIcon}
                        getValue={lowPressure2.getUpdate}
                        safeRangeMin={lowPressure2.range[0]!!}
                        safeRangeMax={lowPressure2.range[1]!!}
                        warningRangeMin={lowPressure2.warningRange[0]!!}
                        warningRangeMax={lowPressure2.warningRange[1]!!}
                        units="bar"
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};

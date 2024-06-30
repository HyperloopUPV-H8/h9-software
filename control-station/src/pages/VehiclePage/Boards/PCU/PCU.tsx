import styles from './PCU.module.scss';
import { Window } from 'components/Window/Window';
import { ColorfulChart, PcuMeasurements, useMeasurementsStore } from 'common';
import DLIM from 'assets/svg/dlim.svg';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import thermometerIcon from 'assets/svg/thermometer-filled.svg';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import thunderIcon from 'assets/svg/thunder-filled.svg';
import pluggedIcon from 'assets/svg/plugged-icon.svg';

export const PCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const motorAPeakCurrent = getNumericMeasurementInfo(
        PcuMeasurements.motorAPeakCurrent
    );
    const motorACurrentU = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentU
    );
    const motorACurrentV = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentV
    );
    const motorACurrentW = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentW
    );
    const motorATemp = getNumericMeasurementInfo(PcuMeasurements.motorATemp);

    const motorBPeakCurrent = getNumericMeasurementInfo(
        PcuMeasurements.motorBPeakCurrent
    );
    const motorBCurrentU = getNumericMeasurementInfo(
        PcuMeasurements.motorBCurrentU
    );
    const motorBCurrentV = getNumericMeasurementInfo(
        PcuMeasurements.motorBCurrentV
    );
    const motorBCurrentW = getNumericMeasurementInfo(
        PcuMeasurements.motorBCurrentW
    );
    const motorBTemp = getNumericMeasurementInfo(PcuMeasurements.motorBTemp);

    const frequency = getNumericMeasurementInfo(PcuMeasurements.frequency);

    return (
        <Window title="PCU">
            <div className={styles.container}>
                <img src={DLIM} alt="DLIM" />

                <div className={styles.content}>
                    <div className={styles.current_display}>
                        <div className={styles.current_chart}>
                            <p className={styles.chart_title}>Motor A</p>
                            <ColorfulChart
                                className={styles.chart}
                                length={35}
                                items={[
                                    motorACurrentU,
                                    motorACurrentV,
                                    motorACurrentW,
                                ]}
                            />
                            <IndicatorStack>
                                <BarIndicator
                                    title="Peak current"
                                    icon={thunderIcon}
                                    getValue={motorAPeakCurrent.getUpdate}
                                    safeRangeMin={motorAPeakCurrent.range[0]!!}
                                    safeRangeMax={motorAPeakCurrent.range[1]!!}
                                    warningRangeMin={
                                        motorAPeakCurrent.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorAPeakCurrent.warningRange[1]!!
                                    }
                                    units={motorAPeakCurrent.units}
                                />
                                <BarIndicator
                                    title="Current U"
                                    icon={thunderIcon}
                                    getValue={motorACurrentU.getUpdate}
                                    safeRangeMin={motorACurrentU.range[0]!!}
                                    safeRangeMax={motorACurrentU.range[1]!!}
                                    warningRangeMin={
                                        motorACurrentU.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorACurrentU.warningRange[1]!!
                                    }
                                    units={motorACurrentU.units}
                                    color="#EE8735"
                                    backgroundColor="#FFE7CF"
                                />
                                <BarIndicator
                                    title="Current V"
                                    icon={thunderIcon}
                                    getValue={motorACurrentV.getUpdate}
                                    safeRangeMin={motorACurrentV.range[0]!!}
                                    safeRangeMax={motorACurrentV.range[1]!!}
                                    warningRangeMin={
                                        motorACurrentV.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorACurrentV.warningRange[1]!!
                                    }
                                    units={motorACurrentV.units}
                                    color="#51C6EB"
                                    backgroundColor="#CEF3FF"
                                />
                                <BarIndicator
                                    title="Current W"
                                    icon={thunderIcon}
                                    getValue={motorACurrentW.getUpdate}
                                    safeRangeMin={motorACurrentW.range[0]!!}
                                    safeRangeMax={motorACurrentW.range[1]!!}
                                    warningRangeMin={
                                        motorACurrentW.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorACurrentW.warningRange[1]!!
                                    }
                                    units={motorACurrentW.units}
                                    color="#7BEE35"
                                    backgroundColor="#E5FFD4"
                                />
                            </IndicatorStack>

                            <IndicatorStack>
                                <BarIndicator
                                    title="Temperature"
                                    icon={thermometerIcon}
                                    getValue={motorATemp.getUpdate}
                                    safeRangeMin={motorATemp.range[0]!!}
                                    safeRangeMax={motorATemp.range[1]!!}
                                    warningRangeMin={
                                        motorATemp.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorATemp.warningRange[1]!!
                                    }
                                    units={motorATemp.units}
                                />
                            </IndicatorStack>
                        </div>

                        <div className={styles.current_chart}>
                            <p className={styles.chart_title}>Motor B</p>
                            <ColorfulChart
                                className={styles.chart}
                                length={35}
                                items={[
                                    motorBCurrentU,
                                    motorBCurrentV,
                                    motorBCurrentW,
                                ]}
                            />
                            <IndicatorStack>
                                <BarIndicator
                                    title="Peak current"
                                    icon={thunderIcon}
                                    getValue={motorBPeakCurrent.getUpdate}
                                    safeRangeMin={motorBPeakCurrent.range[0]!!}
                                    safeRangeMax={motorBPeakCurrent.range[1]!!}
                                    warningRangeMin={
                                        motorBPeakCurrent.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorBPeakCurrent.warningRange[1]!!
                                    }
                                    units="A"
                                />
                                <BarIndicator
                                    title="Current U"
                                    icon={thunderIcon}
                                    getValue={motorBCurrentU.getUpdate}
                                    safeRangeMin={motorBCurrentU.range[0]!!}
                                    safeRangeMax={motorBCurrentU.range[1]!!}
                                    warningRangeMin={
                                        motorBCurrentU.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorBCurrentU.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#EE8735"
                                    backgroundColor="#FFE7CF"
                                />
                                <BarIndicator
                                    title="Current V"
                                    icon={thunderIcon}
                                    getValue={motorBCurrentV.getUpdate}
                                    safeRangeMin={motorBCurrentV.range[0]!!}
                                    safeRangeMax={motorBCurrentV.range[1]!!}
                                    warningRangeMin={
                                        motorBCurrentV.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorBCurrentV.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#51C6EB"
                                    backgroundColor="#CEF3FF"
                                />
                                <BarIndicator
                                    title="Current W"
                                    icon={thunderIcon}
                                    getValue={motorBCurrentW.getUpdate}
                                    safeRangeMin={motorBCurrentW.range[0]!!}
                                    safeRangeMax={motorBCurrentW.range[1]!!}
                                    warningRangeMin={
                                        motorBCurrentW.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorBCurrentW.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#7BEE35"
                                    backgroundColor="#E5FFD4"
                                />
                            </IndicatorStack>

                            <IndicatorStack>
                                <BarIndicator
                                    title="Temperature"
                                    icon={thermometerIcon}
                                    getValue={motorBTemp.getUpdate}
                                    safeRangeMin={motorBTemp.range[0]!!}
                                    safeRangeMax={motorBTemp.range[1]!!}
                                    warningRangeMin={
                                        motorBTemp.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        motorBTemp.warningRange[1]!!
                                    }
                                    units={motorBTemp.units}
                                />
                            </IndicatorStack>
                        </div>
                    </div>
                    <IndicatorStack className={styles.frequency}>
                        <StateIndicator
                            measurementId={PcuMeasurements.generalState}
                            icon={pluggedIcon}
                        />
                        <BarIndicator
                            title="Frequency"
                            icon={thunderIcon}
                            getValue={frequency.getUpdate}
                            safeRangeMin={frequency.range[0]!!}
                            safeRangeMax={frequency.range[1]!!}
                            warningRangeMin={frequency.warningRange[0]!!}
                            warningRangeMax={frequency.warningRange[1]!!}
                            units={frequency.units}
                        />
                    </IndicatorStack>
                </div>

                <img
                    src={DLIM}
                    alt="DLIM"
                    style={{ transform: 'rotate(180deg' }}
                />
            </div>
        </Window>
    );
};

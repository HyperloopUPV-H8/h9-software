import { Window } from 'components/Window/Window';
import { ReactComponent as LSMIcon } from '../../../../assets/svg/lsm.svg';
import styles from './BCU.module.scss';
import { ColorfulChart, BcuMeasurements, useMeasurementsStore } from 'common';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import thunderIcon from 'assets/svg/thunder-filled.svg';

export const BCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const bpu1CurrentU = getNumericMeasurementInfo(
        BcuMeasurements.bpu1CurrentU
    );
    const bpu1CurrentV = getNumericMeasurementInfo(
        BcuMeasurements.bpu1CurrentV
    );
    const bpu1CurrentW = getNumericMeasurementInfo(
        BcuMeasurements.bpu1CurrentW
    );

    const bpu2CurrentU = getNumericMeasurementInfo(
        BcuMeasurements.bpu2CurrentU
    );
    const bpu2CurrentV = getNumericMeasurementInfo(
        BcuMeasurements.bpu2CurrentV
    );
    const bpu2CurrentW = getNumericMeasurementInfo(
        BcuMeasurements.bpu2CurrentW
    );

    return (
        <Window title="BCU">
            <div className={styles.container}>
                <LSMIcon />

                <div className={styles.content}>
                    <div className={styles.current_display}>
                        <div className={styles.current_chart}>
                            <p className={styles.chart_title}>BPU 1</p>
                            <ColorfulChart
                                className={styles.chart}
                                length={35}
                                items={[
                                    bpu1CurrentU,
                                    bpu1CurrentV,
                                    bpu1CurrentW,
                                ]}
                            />
                            <IndicatorStack>
                                <BarIndicator
                                    title="Current U"
                                    icon={thunderIcon}
                                    getValue={bpu1CurrentU.getUpdate}
                                    safeRangeMin={bpu1CurrentU.range[0]!!}
                                    safeRangeMax={bpu1CurrentU.range[1]!!}
                                    warningRangeMin={
                                        bpu1CurrentU.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu1CurrentU.warningRange[1]!!
                                    }
                                    units={bpu1CurrentU.units}
                                    color="#EE8735"
                                    backgroundColor="#FFE7CF"
                                />
                                <BarIndicator
                                    title="Current V"
                                    icon={thunderIcon}
                                    getValue={bpu1CurrentV.getUpdate}
                                    safeRangeMin={bpu1CurrentV.range[0]!!}
                                    safeRangeMax={bpu1CurrentV.range[1]!!}
                                    warningRangeMin={
                                        bpu1CurrentV.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu1CurrentV.warningRange[1]!!
                                    }
                                    units={bpu1CurrentV.units}
                                    color="#51C6EB"
                                    backgroundColor="#CEF3FF"
                                />
                                <BarIndicator
                                    title="Current W"
                                    icon={thunderIcon}
                                    getValue={bpu1CurrentW.getUpdate}
                                    safeRangeMin={bpu1CurrentW.range[0]!!}
                                    safeRangeMax={bpu1CurrentW.range[1]!!}
                                    warningRangeMin={
                                        bpu1CurrentW.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu1CurrentW.warningRange[1]!!
                                    }
                                    units={bpu1CurrentW.units}
                                    color="#7BEE35"
                                    backgroundColor="#E5FFD4"
                                />
                            </IndicatorStack>
                        </div>

                        <div className={styles.current_chart}>
                            <p className={styles.chart_title}>BPU 2</p>
                            <ColorfulChart
                                className={styles.chart}
                                length={35}
                                items={[
                                    bpu2CurrentU,
                                    bpu2CurrentV,
                                    bpu2CurrentW,
                                ]}
                            />
                            <IndicatorStack>
                                <BarIndicator
                                    title="Current U"
                                    icon={thunderIcon}
                                    getValue={bpu2CurrentU.getUpdate}
                                    safeRangeMin={bpu2CurrentU.range[0]!!}
                                    safeRangeMax={bpu2CurrentU.range[1]!!}
                                    warningRangeMin={
                                        bpu2CurrentU.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu2CurrentU.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#EE8735"
                                    backgroundColor="#FFE7CF"
                                />
                                <BarIndicator
                                    title="Current V"
                                    icon={thunderIcon}
                                    getValue={bpu2CurrentV.getUpdate}
                                    safeRangeMin={bpu2CurrentV.range[0]!!}
                                    safeRangeMax={bpu2CurrentV.range[1]!!}
                                    warningRangeMin={
                                        bpu2CurrentV.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu2CurrentV.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#51C6EB"
                                    backgroundColor="#CEF3FF"
                                />
                                <BarIndicator
                                    title="Current W"
                                    icon={thunderIcon}
                                    getValue={bpu2CurrentW.getUpdate}
                                    safeRangeMin={bpu2CurrentW.range[0]!!}
                                    safeRangeMax={bpu2CurrentW.range[1]!!}
                                    warningRangeMin={
                                        bpu2CurrentW.warningRange[0]!!
                                    }
                                    warningRangeMax={
                                        bpu2CurrentW.warningRange[1]!!
                                    }
                                    units="A"
                                    color="#7BEE35"
                                    backgroundColor="#E5FFD4"
                                />
                            </IndicatorStack>
                        </div>
                    </div>
                </div>

                <LSMIcon style={{ transform: 'rotate(180deg)' }} />
            </div>
        </Window>
    );
};

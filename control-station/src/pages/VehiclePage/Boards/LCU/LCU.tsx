import { Window } from 'components/Window/Window';
import styles from './LCU.module.scss';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import pitchRotation from 'assets/svg/pitch-rotation.svg';
import yawRotation from 'assets/svg/yaw-rotation.svg';
import rollRotation from 'assets/svg/roll-rotation.svg';
import zIndex from 'assets/svg/z-index.svg';
import yIndex from 'assets/svg/y-index.svg';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { LevitationUnit } from 'components/LevitationUnit/LevitationUnit';
import { LcuMeasurements, useMeasurementsStore } from 'common';

export const LCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const pitch = getNumericMeasurementInfo(LcuMeasurements.rotationPitch);
    const roll = getNumericMeasurementInfo(LcuMeasurements.rotationRoll);
    const yaw = getNumericMeasurementInfo(LcuMeasurements.rotationYaw);
    const positionY = getNumericMeasurementInfo(LcuMeasurements.positionY);
    const positionZ = getNumericMeasurementInfo(LcuMeasurements.positionZ);

    return (
        <Window title="LCU">
            <div className={styles.LCUWrapper}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>
                        <LevitationUnit
                            unitIndex={0}
                            kind="hems"
                            imageSide="left"
                        />
                        <LevitationUnit
                            unitIndex={4}
                            kind="ems"
                            imageSide="left"
                        />
                        <LevitationUnit
                            unitIndex={6}
                            kind="ems"
                            imageSide="left"
                        />
                        <LevitationUnit
                            unitIndex={8}
                            kind="ems"
                            imageSide="left"
                        />
                        <LevitationUnit
                            unitIndex={2}
                            kind="hems"
                            imageSide="left"
                        />
                    </div>

                    <div className={styles.levitationUnitsColumn}>
                        <LevitationUnit
                            unitIndex={1}
                            kind="hems"
                            imageSide="right"
                        />
                        <LevitationUnit
                            unitIndex={5}
                            kind="ems"
                            imageSide="right"
                        />
                        <LevitationUnit
                            unitIndex={7}
                            kind="ems"
                            imageSide="right"
                        />
                        <LevitationUnit
                            unitIndex={9}
                            kind="ems"
                            imageSide="right"
                        />
                        <LevitationUnit
                            unitIndex={3}
                            kind="hems"
                            imageSide="right"
                        />
                    </div>
                </div>

                <div className={styles.rotationIndicatorsWrapper}>
                    <IndicatorStack>
                        <BarIndicator
                            icon={pitchRotation}
                            title="Pitch"
                            getValue={pitch.getUpdate}
                            safeRangeMin={pitch.range[0] ?? -0.05}
                            safeRangeMax={pitch.range[1] ?? 0.05}
                            warningRangeMin={pitch.warningRange[0] ?? -0.1}
                            warningRangeMax={pitch.warningRange[1] ?? 0.1}
                            units={roll.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={rollRotation}
                            title="Roll"
                            getValue={roll.getUpdate}
                            safeRangeMin={roll.range[0] ?? -0.05}
                            safeRangeMax={roll.range[1] ?? 0.05}
                            warningRangeMin={roll.warningRange[0] ?? -0.1}
                            warningRangeMax={roll.warningRange[1] ?? 0.1}
                            units={roll.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={yawRotation}
                            title="Yaw"
                            getValue={yaw.getUpdate}
                            safeRangeMin={yaw.range[0] ?? -0.005}
                            safeRangeMax={yaw.range[1] ?? 0.005}
                            warningRangeMin={yaw.warningRange[0] ?? -0.01}
                            warningRangeMax={yaw.warningRange[1] ?? 0.01}
                            units={yaw.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={zIndex}
                            title="Z"
                            getValue={positionZ.getUpdate}
                            safeRangeMin={positionZ.range[0] ?? -2}
                            safeRangeMax={positionZ.range[1] ?? 2}
                            warningRangeMin={positionZ.warningRange[0] ?? -10}
                            warningRangeMax={positionZ.warningRange[1] ?? 10}
                            units={positionZ.units}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator
                            icon={yIndex}
                            title="Y"
                            getValue={positionY.getUpdate}
                            safeRangeMin={positionY.range[0] ?? -5}
                            safeRangeMax={positionY.range[1] ?? 5}
                            warningRangeMin={positionY.warningRange[0] ?? -10}
                            warningRangeMax={positionY.warningRange[1] ?? 10}
                            units={positionY.units}
                        />
                    </IndicatorStack>
                </div>
            </div>
        </Window>
    );
};

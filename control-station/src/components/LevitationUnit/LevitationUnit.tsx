import { LcuMeasurements } from 'common';
import styles from './LevitationUnit.module.scss';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import batteryFilled from 'assets/svg/battery-filled.svg';
import thermometerFilled from 'assets/svg/thermometer-filled.svg';
import { useMeasurementsStore } from 'common';
import EMSRepresentation from './EMSRepresentation/EMSRepresentation';
import HEMSRepresentation from './HEMSRepresentation/HEMSRepresentation';
export interface Props {
    unitIndex: number;
    imageSide: 'left' | 'right';
    kind: 'ems' | 'hems';
}

export const currentMeasurements = [
    LcuMeasurements.coilCurrentHEMS1,
    LcuMeasurements.coilCurrentHEMS2,
    LcuMeasurements.coilCurrentHEMS3,
    LcuMeasurements.coilCurrentHEMS4,
    LcuMeasurements.coilCurrentEMS1,
    LcuMeasurements.coilCurrentEMS2,
    LcuMeasurements.coilCurrentEMS3,
    LcuMeasurements.coilCurrentEMS4,
    LcuMeasurements.coilCurrentEMS5,
    LcuMeasurements.coilCurrentEMS6,
];

export const temperatureMeasurements = [
    LcuMeasurements.coilTemperatureHEMS1,
    LcuMeasurements.coilTemperatureHEMS2,
    LcuMeasurements.coilTemperatureHEMS3,
    LcuMeasurements.coilTemperatureHEMS4,
    LcuMeasurements.coilTemperatureEMS1,
    LcuMeasurements.coilTemperatureEMS2,
    LcuMeasurements.coilTemperatureEMS3,
    LcuMeasurements.coilTemperatureEMS4,
    LcuMeasurements.coilTemperatureEMS5,
    LcuMeasurements.coilTemperatureEMS6,
];

export const airgapMeasurements = [
    LcuMeasurements.verticalAirgap1,
    LcuMeasurements.verticalAirgap2,
    LcuMeasurements.verticalAirgap3,
    LcuMeasurements.verticalAirgap4,
    LcuMeasurements.horizontalAirgap1,
    LcuMeasurements.horizontalAirgap2,
    LcuMeasurements.horizontalAirgap1,
    LcuMeasurements.horizontalAirgap2,
    LcuMeasurements.horizontalAirgap3,
    LcuMeasurements.horizontalAirgap4,
];

export const LevitationUnit = ({ unitIndex, kind, imageSide }: Props) => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const current = getNumericMeasurementInfo(currentMeasurements[unitIndex]);
    const temperature = getNumericMeasurementInfo(
        temperatureMeasurements[unitIndex]
    );
    const airgap = getNumericMeasurementInfo(airgapMeasurements[unitIndex]);
    const airgap2 =
        unitIndex == 6 || unitIndex == 7
            ? getNumericMeasurementInfo(airgapMeasurements[unitIndex + 2])
            : undefined;

    console.log(
        unitIndex,
        currentMeasurements[unitIndex],
        temperatureMeasurements[unitIndex],
        airgapMeasurements[unitIndex],
        current,
        temperature,
        airgap
    );

    return (
        <div className={styles.levitationUnitWrapper}>
            {imageSide === 'left' &&
                (kind == 'ems' ? (
                    <EMSRepresentation
                        getUpdate={
                            unitIndex == 6 || unitIndex == 7
                                ? () =>
                                      (airgap.getUpdate() +
                                          airgap2!.getUpdate()) /
                                      2
                                : airgap.getUpdate
                        }
                        rangeMin={airgap.warningRange[0] ?? 0}
                        rangeMax={airgap.warningRange[1] ?? 0}
                        side={imageSide}
                    />
                ) : (
                    <HEMSRepresentation
                        getUpdate={
                            unitIndex == 6 || unitIndex == 7
                                ? () =>
                                      (airgap.getUpdate() +
                                          airgap2!.getUpdate()) /
                                      2
                                : airgap.getUpdate
                        }
                        rangeMin={airgap.warningRange[0] ?? 0}
                        rangeMax={airgap.warningRange[1] ?? 0}
                    />
                ))}
            <IndicatorStack>
                <BarIndicator
                    icon={batteryFilled}
                    title="Current"
                    getValue={current.getUpdate}
                    units={current.units}
                    safeRangeMin={current.range[0] ?? -25}
                    safeRangeMax={current.range[1] ?? 25}
                    warningRangeMin={current.warningRange[0] ?? -50}
                    warningRangeMax={current.warningRange[1] ?? 50}
                />
                <BarIndicator
                    icon={thermometerFilled}
                    title="Temperature"
                    getValue={temperature.getUpdate}
                    units={temperature.units}
                    safeRangeMin={temperature.range[0] ?? 0}
                    safeRangeMax={temperature.range[1] ?? 40}
                    warningRangeMin={temperature.warningRange[0] ?? -10}
                    warningRangeMax={temperature.warningRange[1] ?? 80}
                />
                <BarIndicator
                    icon={batteryFilled}
                    title="Airgap"
                    getValue={
                        unitIndex == 6 || unitIndex == 7
                            ? () =>
                                  (airgap.getUpdate() + airgap2!.getUpdate()) /
                                  2
                            : airgap.getUpdate
                    }
                    units={airgap.units}
                    safeRangeMin={airgap.range[0] ?? 0}
                    safeRangeMax={airgap.range[1] ?? 0}
                    warningRangeMin={airgap.warningRange[0] ?? 0}
                    warningRangeMax={airgap.warningRange[1] ?? 0}
                />
            </IndicatorStack>
            {imageSide === 'right' &&
                (kind == 'ems' ? (
                    <EMSRepresentation
                        getUpdate={
                            unitIndex == 6 || unitIndex == 7
                                ? () =>
                                      (airgap.getUpdate() +
                                          airgap2!.getUpdate()) /
                                      2
                                : airgap.getUpdate
                        }
                        rangeMin={airgap.warningRange[0] ?? 0}
                        rangeMax={airgap.warningRange[1] ?? 0}
                        side={imageSide}
                    />
                ) : (
                    <HEMSRepresentation
                        getUpdate={
                            unitIndex == 6 || unitIndex == 7
                                ? () =>
                                      (airgap.getUpdate() +
                                          airgap2!.getUpdate()) /
                                      2
                                : airgap.getUpdate
                        }
                        rangeMin={airgap.warningRange[0] ?? 0}
                        rangeMax={airgap.warningRange[1] ?? 0}
                    />
                ))}
        </div>
    );
};

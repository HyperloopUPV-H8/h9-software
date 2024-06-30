import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import batteryIcon from 'assets/svg/battery-filled.svg';
import thermometerIcon from 'assets/svg/thermometer-filled.svg';
import thunderIcon from 'assets/svg/thunder-filled.svg';
import { useGlobalTicker, useMeasurementsStore } from 'common';
import { memo, useState } from 'react';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import styles from './BatteryPack.module.scss';

interface Props {
    stateOfChargeMeasurementId: string;
    temperatureMeasurementId: string;
    maxCellMeasurementId: string;
    minCellMeasurementId: string;
    voltageMeasurementId: string;
    isBalancingMeasurementId: string;
}

export const BatteryPack = memo(
    ({
        stateOfChargeMeasurementId,
        temperatureMeasurementId,
        maxCellMeasurementId,
        minCellMeasurementId,
        voltageMeasurementId,
        isBalancingMeasurementId,
    }: Props) => {
        const getNumericMeasurementInfo = useMeasurementsStore(
            (state) => state.getNumericMeasurementInfo
        );
        const getBooleanMeasurementInfo = useMeasurementsStore(
            (state) => state.getBooleanMeasurementInfo
        );

        const stateOfChargeMeasurement = getNumericMeasurementInfo(
            stateOfChargeMeasurementId
        );
        const temperatureMeasurement = getNumericMeasurementInfo(
            temperatureMeasurementId
        );
        const maxCellMeasurement =
            getNumericMeasurementInfo(maxCellMeasurementId);
        const minCellMeasurement =
            getNumericMeasurementInfo(minCellMeasurementId);
        const voltageMeasurement =
            getNumericMeasurementInfo(voltageMeasurementId);
        const isBalancingMeasurement = getBooleanMeasurementInfo(
            isBalancingMeasurementId
        );

        const [isBalancing, setIsBalancing] = useState(false);
        useGlobalTicker(() =>
            setIsBalancing(isBalancingMeasurement.getUpdate())
        );

        return (
            <IndicatorStack
                className={isBalancing ? styles.balancing : styles.idle}
            >
                <BarIndicator
                    icon={batteryIcon}
                    title="SoC"
                    getValue={stateOfChargeMeasurement.getUpdate}
                    safeRangeMin={stateOfChargeMeasurement.range[0]!!}
                    safeRangeMax={stateOfChargeMeasurement.range[1]!!}
                    warningRangeMin={stateOfChargeMeasurement.warningRange[0]!!}
                    warningRangeMax={stateOfChargeMeasurement.warningRange[1]!!}
                    units={stateOfChargeMeasurement.units}
                />
                <BarIndicator
                    icon={thermometerIcon}
                    title="Temperature"
                    getValue={temperatureMeasurement.getUpdate}
                    safeRangeMin={temperatureMeasurement.range[0]!!}
                    safeRangeMax={temperatureMeasurement.range[1]!!}
                    warningRangeMin={temperatureMeasurement.warningRange[0]!!}
                    warningRangeMax={temperatureMeasurement.warningRange[1]!!}
                    units={temperatureMeasurement.units}
                />
                <BarIndicator
                    icon={thunderIcon}
                    title="Max Cell"
                    getValue={maxCellMeasurement.getUpdate}
                    safeRangeMin={maxCellMeasurement.range[0]!!}
                    safeRangeMax={maxCellMeasurement.range[1]!!}
                    warningRangeMin={maxCellMeasurement.warningRange[0]!!}
                    warningRangeMax={maxCellMeasurement.warningRange[1]!!}
                    units={maxCellMeasurement.units}
                />
                <BarIndicator
                    icon={thunderIcon}
                    title="Min Cell"
                    getValue={minCellMeasurement.getUpdate}
                    safeRangeMin={minCellMeasurement.range[0]!!}
                    safeRangeMax={minCellMeasurement.range[1]!!}
                    warningRangeMin={minCellMeasurement.warningRange[0]!!}
                    warningRangeMax={minCellMeasurement.warningRange[1]!!}
                    units={minCellMeasurement.units}
                />
                <BarIndicator
                    icon={thunderIcon}
                    title="Voltage"
                    getValue={voltageMeasurement.getUpdate}
                    safeRangeMin={voltageMeasurement.range[0]!!}
                    safeRangeMax={voltageMeasurement.range[1]!!}
                    warningRangeMin={voltageMeasurement.warningRange[0]!!}
                    warningRangeMax={voltageMeasurement.warningRange[1]!!}
                    units={voltageMeasurement.units}
                />
            </IndicatorStack>
        );
    }
);

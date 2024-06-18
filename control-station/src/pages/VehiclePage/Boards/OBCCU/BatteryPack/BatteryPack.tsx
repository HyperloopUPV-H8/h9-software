import { BarIndicator } from 'components/BarIndicator/BarIndicator'
import batteryIcon from "assets/svg/battery-filled.svg"
import thermometerIcon from "assets/svg/thermometer-filled.svg"
import thunderIcon from "assets/svg/thunder-filled.svg"
import { useMeasurementsStore } from 'common'
import { memo } from 'react'
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack'

interface Props {
    stateOfChargeMeasurementId: string;
    temperatureMeasurementId: string;
    maxCellMeasurementId: string;
    minCellMeasurementId: string;
    voltageMeasurementId: string;
}

export const BatteryPack = memo((
    {
        stateOfChargeMeasurementId,
        temperatureMeasurementId,
        maxCellMeasurementId,
        minCellMeasurementId,
        voltageMeasurementId
    }: Props
) => {
    
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo)
    const stateOfChargeMeasurement = getNumericMeasurementInfo(stateOfChargeMeasurementId)
    const temperatureMeasurement = getNumericMeasurementInfo(temperatureMeasurementId)
    const maxCellMeasurement = getNumericMeasurementInfo(maxCellMeasurementId)
    const minCellMeasurement = getNumericMeasurementInfo(minCellMeasurementId)
    const voltageMeasurement = getNumericMeasurementInfo(voltageMeasurementId)

    return (
        <IndicatorStack>
            <BarIndicator
                icon={batteryIcon}
                title="SoC"
                getValue = {stateOfChargeMeasurement.getUpdate}
                safeRangeMin={stateOfChargeMeasurement.range[0]!!}
                safeRangeMax={stateOfChargeMeasurement.range[1]!!}
                units="%"
            />
            <BarIndicator 
                icon={thermometerIcon}
                title="Temperature"
                getValue = {temperatureMeasurement.getUpdate}
                safeRangeMin={temperatureMeasurement.range[0]!!}
                safeRangeMax={temperatureMeasurement.range[1]!!}
                units="ºC"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Max Cell"
                getValue = {maxCellMeasurement.getUpdate}
                safeRangeMin={maxCellMeasurement.range[0]!!}
                safeRangeMax={maxCellMeasurement.range[1]!!}
                units="V"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Min Cell"
                getValue = {minCellMeasurement.getUpdate}
                safeRangeMin={minCellMeasurement.range[0]!!}
                safeRangeMax={minCellMeasurement.range[1]!!}
                units="V"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Voltage"
                getValue = {voltageMeasurement.getUpdate}
                safeRangeMin={voltageMeasurement.range[0]!!}
                safeRangeMax={voltageMeasurement.range[1]!!}
                units="V"
            />
        </IndicatorStack>
    )
})

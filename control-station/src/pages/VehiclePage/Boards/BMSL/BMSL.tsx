import { Window } from 'components/Window/Window';
import { GaugeTag } from 'components/GaugeTag/GaugeTag';
import { BmslMeasurements, useMeasurementsStore } from 'common';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import batteryIcon from 'assets/svg/battery-filled.svg';
import thermometerIcon from 'assets/svg/thermometer-filled.svg';

export const BMSL = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const cell1 = getNumericMeasurementInfo(BmslMeasurements.cell1);
    const cell2 = getNumericMeasurementInfo(BmslMeasurements.cell2);
    const cell3 = getNumericMeasurementInfo(BmslMeasurements.cell3);
    const cell4 = getNumericMeasurementInfo(BmslMeasurements.cell4);
    const cell5 = getNumericMeasurementInfo(BmslMeasurements.cell5);
    const cell6 = getNumericMeasurementInfo(BmslMeasurements.cell6);

    const temp1 = getNumericMeasurementInfo(BmslMeasurements.temp1);
    const temp2 = getNumericMeasurementInfo(BmslMeasurements.temp2);

    const totalVoltage = getNumericMeasurementInfo(
        BmslMeasurements.totalVoltage
    );
    const dischargeCurrent = getNumericMeasurementInfo(
        BmslMeasurements.dischargeCurrent
    );

    return (
        <Window title="BMSL">
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '1rem',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexFlow: 'row',
                        gap: '.5rem',
                    }}
                >
                    <GaugeTag
                        id="bmsl_general_voltage"
                        name={'Voltage'}
                        units={'Volts'}
                        getUpdate={totalVoltage.getUpdate}
                        strokeWidth={120}
                        min={totalVoltage.warningRange[0] ?? 225}
                        max={totalVoltage.warningRange[1] ?? 252}
                    />
                    <GaugeTag
                        id="bmsl_general_current"
                        name={'Current'}
                        units={'Amps'}
                        getUpdate={dischargeCurrent.getUpdate}
                        strokeWidth={120}
                        min={dischargeCurrent.warningRange[0] ?? 0}
                        max={dischargeCurrent.warningRange[1] ?? 100}
                    />
                </div>

                <IndicatorStack>
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 1"
                        getValue={cell1.getUpdate}
                        safeRangeMin={cell1.range[0]!!}
                        safeRangeMax={cell1.range[1]!!}
                        warningRangeMin={cell1.warningRange[0]!!}
                        warningRangeMax={cell1.warningRange[1]!!}
                        units={cell1.units}
                    />
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 2"
                        getValue={cell2.getUpdate}
                        safeRangeMin={cell2.range[0]!!}
                        safeRangeMax={cell2.range[1]!!}
                        warningRangeMin={cell2.warningRange[0]!!}
                        warningRangeMax={cell2.warningRange[1]!!}
                        units={cell2.units}
                    />
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 3"
                        getValue={cell3.getUpdate}
                        safeRangeMin={cell3.range[0]!!}
                        safeRangeMax={cell3.range[1]!!}
                        warningRangeMin={cell3.warningRange[0]!!}
                        warningRangeMax={cell3.warningRange[1]!!}
                        units={cell3.units}
                    />
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 4"
                        getValue={cell4.getUpdate}
                        safeRangeMin={cell4.range[0]!!}
                        safeRangeMax={cell4.range[1]!!}
                        warningRangeMin={cell4.warningRange[0]!!}
                        warningRangeMax={cell4.warningRange[1]!!}
                        units={cell4.units}
                    />
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 5"
                        getValue={cell5.getUpdate}
                        safeRangeMin={cell5.range[0]!!}
                        safeRangeMax={cell5.range[1]!!}
                        warningRangeMin={cell5.warningRange[0]!!}
                        warningRangeMax={cell5.warningRange[1]!!}
                        units={cell5.units}
                    />
                    <BarIndicator
                        icon={batteryIcon}
                        title="Cell 6"
                        getValue={cell6.getUpdate}
                        safeRangeMin={cell6.range[0]!!}
                        safeRangeMax={cell6.range[1]!!}
                        warningRangeMin={cell6.warningRange[0]!!}
                        warningRangeMax={cell6.warningRange[1]!!}
                        units={cell6.units}
                    />
                </IndicatorStack>

                <IndicatorStack>
                    <BarIndicator
                        icon={thermometerIcon}
                        title="Temp 1"
                        getValue={temp1.getUpdate}
                        safeRangeMin={temp1.range[0]!!}
                        safeRangeMax={temp1.range[1]!!}
                        warningRangeMin={temp1.warningRange[0]!!}
                        warningRangeMax={temp1.warningRange[1]!!}
                        units={temp1.units}
                    />
                    <BarIndicator
                        icon={thermometerIcon}
                        title="Temp 2"
                        getValue={temp2.getUpdate}
                        safeRangeMin={temp2.range[0]!!}
                        safeRangeMax={temp2.range[1]!!}
                        warningRangeMin={temp2.warningRange[0]!!}
                        warningRangeMax={temp2.warningRange[1]!!}
                        units={temp2.units}
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};

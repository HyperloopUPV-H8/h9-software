import styles from './VCU.module.scss';
import { Window } from 'components/Window/Window';
import { useMeasurementsStore, VcuMeasurements } from 'common';
import { GaugeTag } from 'components/GaugeTag/GaugeTag';
import vehicleTrack from 'assets/svg/vehicle-track.svg';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import thermometerIcon from 'assets/svg/thermometer-filled.svg';
import { TrackVisualizer } from './TrackVisualizer/TrackVisualizer';

export const VCUPositionInfo = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );
    const speed = getNumericMeasurementInfo(VcuMeasurements.speed);
    const acceleration = getNumericMeasurementInfo(
        VcuMeasurements.acceleration
    );
    const position = getNumericMeasurementInfo(VcuMeasurements.position);

    return (
        <Window title="VCU">
            <div className={styles.vcuPositionInfo}>
                <IndicatorStack>
                    <BarIndicator
                        title="Position"
                        icon={thermometerIcon}
                        getValue={position.getUpdate}
                        safeRangeMin={position.range[0]!!}
                        safeRangeMax={position.range[1]!!}
                        warningRangeMin={position.warningRange[0]!!}
                        warningRangeMax={position.warningRange[1]!!}
                        units="m"
                    />
                </IndicatorStack>
                <div className={styles.row}>
                    <GaugeTag
                        id="vcu_position_speed"
                        name={speed.name}
                        units={speed.units}
                        getUpdate={speed.getUpdate}
                        strokeWidth={120}
                        min={speed.warningRange[0] || 0}
                        max={speed.warningRange[1] || 50}
                    />
                    <GaugeTag
                        id="vcu_position_acceleration"
                        name={acceleration.name}
                        units={acceleration.units}
                        getUpdate={acceleration.getUpdate}
                        strokeWidth={120}
                        min={acceleration.warningRange[0] || 0}
                        max={acceleration.warningRange[1] || 19.6}
                    />
                </div>

                <TrackVisualizer
                    getUpdate={position.getUpdate}
                    rangeMin={position.warningRange[0] || 0}
                    rangeMax={position.warningRange[1] || 50}
                />
            </div>
        </Window>
    );
};

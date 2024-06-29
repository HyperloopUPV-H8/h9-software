import styles from './VCU.module.scss';
import { Window } from 'components/Window/Window';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import thermometerIcon from 'assets/svg/thermometer-filled.svg';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import { VcuMeasurements } from 'common';

export const VCUConnectionsInfo = () => {
    return (
        <Window title="VCU">
            <div style={{ display: 'flex', flexFlow: 'column', gap: '0.5rem' }}>
                <IndicatorStack>
                    <StateIndicator
                        measurementId={VcuMeasurements.generalState}
                        icon={thermometerIcon}
                    />
                </IndicatorStack>
                <IndicatorStack className={styles.connections}>
                    <StateIndicator
                        measurementId={VcuMeasurements.pcuConnection}
                        icon={thermometerIcon}
                    />
                    <StateIndicator
                        measurementId={VcuMeasurements.obccuConnection}
                        icon={thermometerIcon}
                    />
                    <StateIndicator
                        measurementId={VcuMeasurements.lcuConnection}
                        icon={thermometerIcon}
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};

import styles from './VCU.module.scss';
import { Window } from 'components/Window/Window';
import { IndicatorStack } from 'components/IndicatorStack/IndicatorStack';
import pluggedIcon from 'assets/svg/plugged-icon.svg';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';
import { VcuMeasurements } from 'common';

export const VCUConnectionsInfo = () => {
    return (
        <Window title="VCU">
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '0.5rem',
                    width: '100%',
                }}
            >
                <IndicatorStack>
                    <StateIndicator
                        measurementId={VcuMeasurements.generalState}
                        icon={pluggedIcon}
                    />
                </IndicatorStack>
                <IndicatorStack className={styles.connections}>
                    <StateIndicator
                        measurementId={VcuMeasurements.pcuConnection}
                        icon={pluggedIcon}
                    />
                    <StateIndicator
                        measurementId={VcuMeasurements.obccuConnection}
                        icon={pluggedIcon}
                    />
                    <StateIndicator
                        measurementId={VcuMeasurements.lcuConnection}
                        icon={pluggedIcon}
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};

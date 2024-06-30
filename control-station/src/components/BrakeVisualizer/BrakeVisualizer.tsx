import styles from './BrakeVisualizer.module.scss';
import brakeContracted from 'assets/svg/brake-contracted.svg';
import brakeExtended from 'assets/svg/brake-extended.svg';
import { useGlobalTicker } from 'common';
import { useState } from 'react';

interface Props {
    getStatus: () => string;
    rotation: 'left' | 'right';
}

export const BrakeVisualizer = ({ getStatus, rotation }: Props) => {
    const [status, setStatus] = useState(getStatus());

    useGlobalTicker(() => {
        setStatus(getStatus());
    });

    return (
        <div
            className={styles.brakeVisualizerWrapper}
            style={{
                transform: rotation === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
            }}
        >
            <img
                src={status == 'EXTENDED' ? brakeExtended : brakeContracted}
                alt={
                    status == 'EXTENDED' ? 'Brake Extended' : 'Brake Contracted'
                }
            />
        </div>
    );
};

import { useState } from 'react';
import { useGlobalTicker } from '../../../../services';
import styles from './LegendItem.module.scss';

type Props = {
    name: string;
    getValue: () => number;
    units: string;
    color: string;
};

export const LegendItem = ({ name, units, getValue, color }: Props) => {
    const [value, setValue] = useState(getValue());

    useGlobalTicker(() => setValue(getValue()));

    return (
        <div className={styles.legendItem}>
            <div className={styles.name} style={{ backgroundColor: color }}>
                {name}
            </div>
            <div className={styles.value}>
                <span>{value.toFixed(2)}</span> <span>{units}</span>
            </div>
        </div>
    );
};

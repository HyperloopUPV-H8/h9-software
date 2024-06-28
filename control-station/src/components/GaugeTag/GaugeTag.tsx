import styles from 'components/GaugeTag/GaugeTag.module.scss';
import { Gauge } from 'components/GaugeTag/Gauge/Gauge';
import { TextData } from './TextData/TextData';
import { memo, useEffect, useRef, useState } from 'react';
import { useGlobalTicker } from 'common';
import { getPercentageFromRange } from 'state';

type Props = {
    name: string;
    id: string;
    units: string;
    getUpdate: () => number;
    strokeWidth: number;
    min: number;
    max: number;
};
export const GaugeTag = memo(
    ({ name, units, id, getUpdate, strokeWidth, min, max }: Props) => {
        const [value, setValue] = useState(getUpdate());
        const percentage = useRef(0);

        useGlobalTicker(() => {
            setValue(getUpdate());
        });

        useEffect(() => {
            percentage.current = getPercentageFromRange(value, min, max);
        });

        return (
            <article className={styles.gaugeTagWrapper}>
                <Gauge
                    className={styles.gauge}
                    id={id}
                    sweep={250}
                    strokeWidth={strokeWidth}
                    percentage={percentage.current}
                />
                <TextData name={name} units={units} value={value}></TextData>
            </article>
        );
    }
);

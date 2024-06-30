import styles from './ColorfulChart.module.scss';
import { Legend } from './Legend/Legend';
import { Title } from './Title/Title';
import { LinesChart } from '../LinesChart/LinesChart';
import { LineDescription } from '../LinesChart/types';
import { useMemo } from 'react';

const palette = ['#EE8735', '#51C6EB', '#7BEE35', '#e469ca'];

type Props = {
    className?: string;
    title?: string;
    items: LineDescription[];
    length: number;
    height?: string;
    showLegend?: boolean;
    showTitle?: boolean;
};

export const ColorfulChart = ({
    className = '',
    title = '',
    items,
    length,
    height = '8rem',
    showLegend = false,
    showTitle = false,
}: Props) => {
    const itemsWithPalette = useMemo(
        () =>
            items.map((item, index) => ({
                ...item,
                color: palette[index % palette.length],
            })),
        [items]
    );

    return (
        <div className={`${styles.colorfulChart} ${className}`}>
            {showTitle && <Title title={title} />}
            <div className={styles.body}>
                <LinesChart
                    height={height}
                    divisions={4}
                    showGrid={false}
                    items={itemsWithPalette}
                    length={length}
                />
                {showLegend && <Legend items={itemsWithPalette} />}
            </div>
        </div>
    );
};

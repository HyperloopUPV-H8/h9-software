import styles from 'components/GaugeTag/Gauge/BackgroundArc/BackgroundArc.module.scss';
import { Arc } from 'components/GaugeTag/Gauge/Arc/Arc';
type Props = React.ComponentProps<typeof Arc> & { id: string };

export const BackgroundArc = ({
    percentage,
    id,
    radius,
    strokeWidth,
    sweep,
    className,
}: Props) => {
    return (
        <>
            <defs>
                <mask id={id}>
                    <Arc
                        sweep={sweep}
                        radius={radius}
                        strokeWidth={strokeWidth}
                        percentage={percentage}
                        className={styles.maskArc}
                    ></Arc>
                </mask>
            </defs>

            <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
                mask={`url(#${id})`}
            >
                <div
                    className={className}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </foreignObject>
        </>
    );
};

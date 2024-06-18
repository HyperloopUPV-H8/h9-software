import styles from "components/GaugeTag/Gauge/BackgroundArc/BackgroundArc.module.scss";
import { Arc } from "components/GaugeTag/Gauge/Arc/Arc";
type Props = React.ComponentProps<typeof Arc>;

export const BackgroundArc = ({
    percentage,
    radius,
    strokeWidth,
    sweep,
    className,
}: Props) => {
    return (
        <>
            <defs>
                <mask id="myMask">
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
                mask="url(#myMask)"
            >
                <div
                    className={className}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </foreignObject>
        </>
    );
};

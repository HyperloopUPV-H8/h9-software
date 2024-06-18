type Props = {
    sweep: number;
    percentage: number;
    radius: number;
    strokeWidth: number;
    className: string;
};

export const Arc = ({
    sweep,
    strokeWidth,
    percentage,
    radius,
    className,
}: Props) => {
    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;
    const fullArc = circumference * (sweep / 360);
    const filledArc = fullArc * (percentage / 100);

    // Setting circunference as the length of the gap ensures no second dash is drawn
    const dashArray = `${filledArc} ${circumference}`;
    const transform = `rotate(${-90 - sweep / 2}, ${radius}, ${radius})`;
    return (
        <circle
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className={className}
            cx={radius}
            cy={radius}
            fill="transparent"
            r={innerRadius}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeLinecap={"round"}
            transform={transform}
            style={{
                transition: "stroke-dasharray 0.1s linear",
            }}
        />
    );
};

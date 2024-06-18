import "./Bar.scss";
import { RangeBar } from "./RangeBar/RangeBar";
import { BoolBar } from "./BoolBar/BoolBar";
export type BarType = "range" | "temp" | "bool";

type Props = {
    type: BarType;
    value: number | boolean | string;
    min?: number;
    max?: number;
};

export const Bar = ({ type = "range", value, min, max }: Props) => {
    const lookup = {
        range: (
            <RangeBar
                type="range"
                value={value as number}
                min={min!}
                max={max!}
            />
        ),
        temp: (
            <RangeBar
                type="temp"
                value={value as number}
                min={min!}
                max={max!}
            />
        ),
        bool: <BoolBar isOn={value as boolean} />,
    };

    return lookup[type];
};

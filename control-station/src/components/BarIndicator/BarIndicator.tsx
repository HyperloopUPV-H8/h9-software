import { useGlobalTicker } from 'common';
import styles from './BarIndicator.module.scss';
import {
    getPercentageFromRange,
    getStateFromRange,
    State,
    stateToColor,
    stateToColorBackground,
} from 'state';
import { memo, useEffect, useRef, useState } from 'react';

interface Props {
    icon?: string;
    title: string;
    getValue: () => number;
    safeRangeMin: number;
    warningRangeMin: number;
    safeRangeMax: number;
    warningRangeMax: number;
    units?: string;
    color?: string;
    backgroundColor?: string;
}

export const BarIndicator = memo(
    ({
        icon,
        title,
        getValue,
        safeRangeMin,
        warningRangeMin,
        safeRangeMax,
        warningRangeMax,
        units,
        color,
        backgroundColor,
    }: Props) => {
        const [valueState, setValueState] = useState<number>(0);
        const percentage = useRef<number>(0);
        const state = useRef<State>(
            getStateFromRange(
                valueState,
                safeRangeMin,
                safeRangeMax,
                warningRangeMin,
                warningRangeMax
            )
        );

        useGlobalTicker(() => {
            setValueState(getValue());
        });

        useEffect(() => {
            percentage.current = getPercentageFromRange(
                valueState,
                warningRangeMin,
                warningRangeMax
            );
            state.current = getStateFromRange(
                valueState,
                safeRangeMin,
                safeRangeMax,
                warningRangeMin,
                warningRangeMax
            );
        });

        return (
            <div className={styles.bar_indicator}>
                <div
                    className={styles.background}
                    style={{
                        backgroundColor:
                            backgroundColor != undefined
                                ? backgroundColor
                                : stateToColorBackground[state.current],
                    }}
                >
                    <div
                        className={styles.range_bar}
                        style={{
                            width: percentage.current + '%',
                            color:
                                color != undefined
                                    ? color
                                    : stateToColor[state.current],
                        }}
                    />
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.iconName}>
                        <img className={styles.icon} src={icon} alt="" />
                        <div className={styles.title}>{title}</div>
                    </div>
                    <div className={styles.valueUnits}>
                        <div className={styles.value}>
                            {valueState?.toFixed(2)}
                        </div>
                        <div className={styles.unit}>{units}</div>
                    </div>
                </div>
            </div>
        );
    }
);

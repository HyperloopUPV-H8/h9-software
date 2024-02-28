import { MeasurementId, NumericMeasurementInfo, UpdateFunction, useGlobalTicker } from "common";
import { ColorType, IChartApi, ISeriesApi, UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type DataSerieAndUpdater = Map<MeasurementId, [ISeriesApi<"Line">, UpdateFunction]>;

interface Props {
    measurementsInChart: NumericMeasurementInfo[];
}

const CHART_HEIGHT = 300;

export const ChartCanvas = ({ measurementsInChart }: Props) => {

    const chart = useRef<IChartApi | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartDataSeries = useRef<DataSerieAndUpdater>(new Map());

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current)
            if(chart)
            chart.current?.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (chartContainerRef.current)
        resizeObserver.observe(chartContainerRef.current);

        if (chartContainerRef.current) {
            if(chart)
            chart.current = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "white" },
                    textColor: "black",
                },
                width: chartContainerRef.current.clientWidth,
                height: CHART_HEIGHT,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                    fixLeftEdge: true,
                    fixRightEdge: true,
                    lockVisibleTimeRangeOnResize: true,
                    rightBarStaysOnScroll: true,
                }
            });
        }

        return () => {
            resizeObserver.disconnect();
            chart.current?.remove();
        }
    }, []);

    useEffect(() => {
        chartDataSeries.current.clear();
        measurementsInChart.forEach((measurement) => {
            if(chart.current)
            chartDataSeries.current.set(measurement.id, [chart.current.addLineSeries({color: measurement.color}), measurement.getUpdate]);
        });
    })

    useGlobalTicker(() => {
        const now = Date.now() / 1000 as UTCTimestamp;
        chartDataSeries.current?.forEach((serieAndUpdater) => {
            const [DataSerie, Updater] = serieAndUpdater;
            DataSerie.update({ time: now, value: Updater() })
        });
    });

    return (
        <div ref={chartContainerRef}></div>
    );
};

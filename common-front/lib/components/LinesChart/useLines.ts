import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { dataToPath } from './path';
import { RangeArray } from './RangeArray';
import { useGlobalTicker } from '../../services/GlobalTicker/useGlobalTicker';
import { Line, LineDescription } from './types';

function getLargestRangeFromPartial(
    ranges: ReadonlyArray<readonly [number | null, number | null]>
) {
    const definedRanges = ranges.map((range) => {
        return [range[0] ?? 0, range[1] ?? 0] as const;
    });

    return getLargestRange(definedRanges);
}

export function useLines(
    viewBoxWidth: number,
    viewBoxHeight: number,
    maxLineLength: number,
    lineDescriptions: LineDescription[]
) {
    const ref = useRef<SVGSVGElement>(null);
    const initialLargestRange = useMemo(
        () =>
            getLargestRangeFromPartial(
                lineDescriptions.map((line) => line.warningRange)
            ),
        []
    );

    const [collectiveRange, setCollectiveRange] = useState(initialLargestRange);

    const lineInstancesRef = useRef<Line[]>([]);

    const updateLines = useCallback(() => {
        const [min, max] = getLargestRange(
            lineInstancesRef.current.map((line) => {
                const currentRange = line.data.getRange();
                return [
                    line.range[0] ?? currentRange[0],
                    line.range[1] ?? currentRange[1],
                ];
            })
        );

        if (min != collectiveRange[0] || max != collectiveRange[1]) {
            setCollectiveRange([min, max]);
        }

        lineInstancesRef.current.forEach((line) => {
            line.data.push(line.getUpdate());
            const updatedData = line.data.getArr();
            const path = dataToPath(
                updatedData,
                maxLineLength,
                min,
                max,
                viewBoxWidth,
                viewBoxHeight
            );

            line.ref.setAttribute('d', path);
        });
    }, []);

    useGlobalTicker(updateLines);

    useLayoutEffect(() => {
        const newLineInstances = createLines(
            lineDescriptions,
            lineInstancesRef.current,
            maxLineLength,
            viewBoxWidth,
            viewBoxHeight
        );

        ref.current?.replaceChildren(
            ...newLineInstances.map((line) => {
                return line.ref;
            })
        );

        lineInstancesRef.current = newLineInstances;
    }, [lineDescriptions]);

    useLayoutEffect(() => {
        return () => {
            ref.current?.replaceChildren();
        };
    }, []);

    return { ref, range: collectiveRange };
}

function createLines(
    descriptions: LineDescription[],
    lines: Line[],
    length: number,
    width: number,
    height: number
): Line[] {
    return descriptions.map((description) => {
        const newHandler =
            lines.find((line) => description.id == line.id)?.data ??
            new RangeArray([], length);

        const [min, max] = getLargestRange(
            lines.map((line) => {
                const currentRange = line.data.getRange();
                return [
                    line.range[0] ?? currentRange[0],
                    line.range[1] ?? currentRange[1],
                ];
            })
        );

        const path = dataToPath(
            newHandler.getArr(),
            length,
            min,
            max,
            width,
            height
        );

        const pathElement = createPathElement(description.color, path);

        return {
            id: description.id,
            name: description.name,
            ref: pathElement,
            range: description.range,
            warningRange: description.warningRange,
            getUpdate: () => description.getUpdate(),
            data:
                lines.find((line) => description.id == line.id)?.data ??
                new RangeArray([], length),
            color: 'red',
        };
    });
}

function createPathElement(color: string, path: string): SVGPathElement {
    const pathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );

    pathElement.setAttribute('vector-effect', 'non-scaling-stroke');
    pathElement.setAttribute('stroke', color);
    pathElement.setAttribute('stroke-width', '3');
    pathElement.setAttribute('stroke-linejoin', 'round');
    pathElement.setAttribute('d', path);
    return pathElement;
}

function getLargestRange(ranges: ReadonlyArray<readonly [number, number]>) {
    let min: number = Infinity;
    let max: number = -Infinity;

    for (const range of ranges) {
        min = range[0] < min ? range[0] : min;
        max = range[1] > max ? range[1] : max;
    }

    return [min, max] as const;
}

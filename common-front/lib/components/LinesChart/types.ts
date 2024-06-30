import { RangeArray } from './RangeArray';

export type LineDescription = {
    readonly id: string;
    readonly name: string;
    readonly range: [number | null, number | null];
    readonly warningRange: [number | null, number | null];
    readonly color: string;
    readonly getUpdate: () => number;
};

export type Line = LineDescription & {
    readonly data: RangeArray;
    readonly ref: SVGPathElement;
};

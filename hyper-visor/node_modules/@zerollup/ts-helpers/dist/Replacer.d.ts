import * as ts from 'typescript';
export interface ReplacerItem extends ts.TextSpan {
    start: number;
    length: number;
    replacement: string;
}
export declare class Replacer {
    private sourceText;
    private items;
    constructor(sourceText: string);
    push(item: ReplacerItem): void;
    getReplaced(): void | string;
}

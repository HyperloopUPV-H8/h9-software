export declare function regExpEscape(s: string): string;
export declare class Tokenizer {
    mask: RegExp;
    tokens: RegExp[];
    subs: string[];
    constructor(pathKey: string, subs: string[], tokens?: string[]);
    parse(str: string): string[] | void;
}

export interface TSOptions {
    paths?: Record<string, string[]>;
    baseUrl?: string;
    exclude?: string[] | undefined;
}
export declare const winSepRegex: RegExp;
export declare const posixSepRegex: RegExp;
export declare class ImportPathsResolver {
    private tokenizers;
    protected baseUrl: string;
    constructor(opts: TSOptions);
    getImportSuggestions(oldImport: string, fileName: string): string[] | undefined;
}

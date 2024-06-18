import { ImportPathsResolver } from '@zerollup/ts-helpers';
import { Config, EmitHost, Program, TransformationContext } from './Types';
export declare class ImportPathInternalResolver {
    protected program: Program | undefined;
    protected config: Config;
    protected resolver: ImportPathsResolver;
    protected emitHost: EmitHost | undefined;
    constructor(program: Program | undefined, transformationContext: TransformationContext, config: Config);
    fileExists(file: string): boolean;
    resolveImport(oldImport: string, currentDir: string): string | undefined;
}

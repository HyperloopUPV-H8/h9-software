import ts from 'typescript';
import { Config, CustomTransformer } from './Types';
export declare function transformPaths(program?: ts.Program, configRaw?: Config): CustomTransformer;

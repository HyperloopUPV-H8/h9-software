import ts from 'typescript';
import { FixNode } from './createFixNode';
import { ImportPathInternalResolver } from './ImportPathInternalResolver';
export interface ImportPathVisitorContext {
    sf: ts.SourceFile;
    fixNode?: FixNode | undefined;
    resolver: ImportPathInternalResolver;
}
export declare function importPathVisitor(node: ts.Node, { fixNode, sf, resolver }: ImportPathVisitorContext): ts.Node | undefined;

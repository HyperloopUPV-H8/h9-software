import { Plugin } from 'rollup';
export declare const typescriptPaths: ({ absolute, nonRelative, preserveExtensions, tsConfigPath, transform, }?: Options) => Plugin;
export interface Options {
    /**
     * Whether to resolve to absolute paths; defaults to `true`.
     */
    absolute?: boolean;
    /**
     * Whether to resolve non-relative paths based on tsconfig's `baseUrl`, even
     * if none of the `paths` are matched; defaults to `false`.
     *
     * @see https://www.typescriptlang.org/docs/handbook/module-resolution.html#relative-vs-non-relative-module-imports
     * @see https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url
     */
    nonRelative?: boolean;
    /**
     * Whether to preserve `.ts` and `.tsx` file extensions instead of having them
     * changed to `.js`; defaults to `false`.
     */
    preserveExtensions?: boolean;
    /**
     * Custom path to your `tsconfig.json`. Use this if the plugin can't seem to
     * find the correct one by itself.
     */
    tsConfigPath?: string;
    /**
     * If the plugin successfully resolves a path, this function allows you to
     * hook into the process and transform that path before it is returned.
     */
    transform?(path: string): string;
}
/**
 * For backwards compatibility.
 */
export declare const resolveTypescriptPaths: ({ absolute, nonRelative, preserveExtensions, tsConfigPath, transform, }?: Options) => Plugin;
export default typescriptPaths;

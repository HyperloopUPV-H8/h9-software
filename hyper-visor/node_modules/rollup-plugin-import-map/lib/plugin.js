import path from 'path';
import fs from 'fs';

const isBare = (str) => {
    if (str.startsWith('/') || str.startsWith('./') || str.startsWith('../') || str.substr(0, 7) === 'http://' || str.substr(0, 8) === 'https://') {
        return false;
    }
    return true;
};

const isString = (str) => typeof str === 'string';

const validate = (map, options) => Object.keys(map.imports).map((key) => {
    const value = map.imports[key];

    if (isBare(value)) {
        throw Error(`Import specifier can NOT be mapped to a bare import statement. Import specifier "${key}" is being wrongly mapped to "${value}"`);
    }

    if (typeof options.external === 'function') {
        if (options.external(key)) throw Error('Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.');
    }

    if (Array.isArray(options.external)) {
        if (options.external.includes(key)) throw Error('Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.');
    }

    return { key, value };
});

const fileReader = (pathname = '', options = {}) => new Promise((resolve, reject) => {
    const filepath = path.normalize(pathname);
    fs.promises.readFile(filepath).then((file) => {
        try {
            const obj = JSON.parse(file);
            resolve(validate(obj, options));
        } catch (error) {
            reject(error);
        }
    }).catch(reject);
});

export function rollupImportMapPlugin(importMaps = []) {
    const cache = new Map();
    const maps = Array.isArray(importMaps) ? importMaps : [importMaps];

    return {
        name: 'rollup-plugin-import-map',

        async buildStart(options) {
            const mappings = maps.map((item) => {
                if (isString(item)) {
                    return fileReader(item, options);
                }
                return validate(item, options);
            });

            await Promise.all(mappings).then((items) => {
                items.forEach((item) => {
                    item.forEach((obj) => {
                        cache.set(obj.key, obj.value);
                    });
                });
            });
        },

        resolveId(importee) {
            const url = cache.get(importee);
            if (url) {
                return {
                    id: url,
                    external: true,
                };
            }
            return null;
        },
    };
}

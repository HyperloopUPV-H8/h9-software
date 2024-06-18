# rollup-plugin-import-map

Rollup plugin to apply [import map](https://github.com/WICG/import-maps#multiple-import-map-support) mapping to ECMAScript modules (ESM) ahead of time.

## Installation

```bash
$ npm install rollup-plugin-import-map
```

## Usage

```js
import { rollupImportMapPlugin } from "rollup-plugin-import-map";

export default {
  input: "source/main.js",
  plugins: [rollupImportMapPlugin('source/import-map.json')],
  output: {
    file: "build.js",
    format: "esm",
  },
};
```

## Description

This plugin transforms import specifiers in ESM based on mappings defined in one or more [import maps](https://github.com/WICG/import-maps#multiple-import-map-support). Import maps are an emerging specification yet to be implemented in browsers, however this module can be used to apply import maps ahead of time.

One use case for import maps is to transform ESM bare import statements to an import statement which is an absolute URL to the same module on a CDN.

Lets say we have the following in our ESM when developing locally with node.js:

```js
import {html, render} from 'lit-html';
```

Then on build we can apply the following import map:

```js
{
  "imports": {
    "lit-html": "https://cdn.eik.dev/npm/lit-html/v1/lit-html.js",
  }
}
```

When applied, our output wil be:

```js
import * as lit from 'https://cdn.eik.dev/npm/lit-html/v1/lit-html.js'
```

## API

The API of the plugin is fairly simple. The plugin can take a absolute path to a import map or an import map as an object directly. Values can be passed on as a single value or an Array of multple values.

An absolute path to a import map file:

```js
export default {
  input: "source/main.js",
  plugins: [rollupImportMapPlugin('source/import-map.json')],
  output: {
    file: "build.js",
    format: "esm",
  },
};
```

Absolute paths to multiple import map files:

```js
export default {
  input: "source/main.js",
  plugins: [rollupImportMapPlugin([
      'source/import-map-a.json',
      'source/import-map-b.json',
      'source/import-map-c.json',
  ])],
  output: {
    file: "build.js",
    format: "esm",
  },
};
```

Mix of absolute paths to import map files and import maps provided as an object:

```js
export default {
  input: "source/main.js",
  plugins: [rollupImportMapPlugin([
      'source/import-map-a.json',
      {
        "imports": {
          "lit-html": "https://cdn.eik.dev/npm/lit-html/v1/lit-html.js",
        }
      },
      'source/import-map-b.json',
  ])],
  output: {
    file: "build.js",
    format: "esm",
  },
};
```

When an array of import maps is provided and multiple import maps use the same import specifier, the last import specifier in the array will be the one which is applied.

## Note on the rollup external option

Any mappings defined by any of the means described above must not occur in the Rollup `external` option.
If so, this module will throw.

In other words, this will not work:

```js
export default {
  input: "source/main.js",
  external: ["lit-element"],
  plugins: [
    rollupImportMapPlugin({
      imports: {
        'lit-element': 'https://cdn.eik.dev/lit-element/v2'
      },
    }),
  ],
  output: {
    file: "build.js",
    format: "esm",
  },
};
```

## License

Copyright (c) 2020 Trygve Lie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

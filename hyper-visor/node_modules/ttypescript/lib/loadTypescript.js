"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTypeScript = void 0;
var fs_1 = require("fs");
var resolve_1 = require("resolve");
var patchCreateProgram_1 = require("./patchCreateProgram");
var path_1 = require("path");
var vm_1 = require("vm");
var Module = require("module");
function loadTypeScript(filename, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.folder, folder = _c === void 0 ? __dirname : _c, _d = _b.forceConfigLoad, forceConfigLoad = _d === void 0 ? false : _d;
    var libFilename = (0, resolve_1.sync)('typescript/lib/' + filename, { basedir: folder });
    if (!require.cache[libFilename]) {
        require.cache[libFilename] = TSModuleFactory(libFilename);
    }
    var ts = TSModuleFactory(libFilename).exports;
    var _e = ts.versionMajorMinor.split('.'), major = _e[0], minor = _e[1];
    if (+major < 3 && +minor < 7) {
        throw new Error('ttypescript supports typescript from 2.7 version');
    }
    return (0, patchCreateProgram_1.patchCreateProgram)(ts, forceConfigLoad);
}
exports.loadTypeScript = loadTypeScript;
var typeScriptFactoryCache = new Map();
function TSModuleFactory(filename) {
    var factory = typeScriptFactoryCache.get(filename);
    if (!factory) {
        var code = (0, fs_1.readFileSync)(filename, 'utf8');
        factory = (0, vm_1.runInThisContext)("(function (exports, require, module, __filename, __dirname) {".concat(code, "\n});"), {
            filename: filename,
            lineOffset: 0,
            displayErrors: true,
        });
        typeScriptFactoryCache.set(filename, factory);
    }
    var newModule = new Module(filename, module);
    factory.call(newModule, newModule.exports, require, newModule, filename, (0, path_1.dirname)(filename));
    return newModule;
}

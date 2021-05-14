const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const pluginNodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const terser = require('rollup-plugin-terser');

const fs = require('fs');
const path = require('path');

const { version, author, contributors } = require('./package.json');

const bannerPath = path.join(__dirname, 'banner.js');
const injectorPath = path.join(__dirname, 'injector.js');
const bannerConfig = {
    version,
    author: [author, ...contributors].join(', '),
};

const extensions = ['.js', '.ts'];
const { ENV = 'dev' } = process.env;

const pluginTerser = terser.terser({
    output: {
        comments: false,
    },
});

module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/TW_Calc.user.js',
        format: 'iife',
        sourcemap: false,
    },
    plugins: [
        pluginNodeResolve.nodeResolve({
            browser: true,
            extensions,
        }),
        typescript({ sourceMap: false, tsconfig: 'tsconfig.json' }),
        commonjs({
            include: /node_modules/,
        }),
        babel.babel({ babelHelpers: 'runtime', extensions, exclude: /node_modules/ }),
        ...(ENV !== 'test' ? [injector()] : []),
        ...(ENV === 'prod' ? [pluginTerser] : []),
        ...(ENV !== 'test' ? [patchMap(), banner()] : []),
    ],
};

// Injector for combatibility with the Greasemonkey on Firefox
// https://stackoverflow.com/questions/13485122/accessing-variables-from-greasemonkey-to-page-vice-versa/13485650#13485650
function injector() {
    return {
        name: 'injector',
        renderChunk(code) {
            let injector = fs.readFileSync(injectorPath, { flat: 'r', encoding: 'utf8' });
            return `var TWCalcJS = function() {${code}};\n${injector}`;
        },
    };
}

function banner() {
    return {
        name: 'banner',
        renderChunk(code) {
            return `${getBannerText()}\n${code}`;
        },
    };

    function getBannerText() {
        let banner = fs.readFileSync(bannerPath, { flag: 'r', encoding: 'utf8' });
        for (let key in bannerConfig) {
            banner = banner.replace(new RegExp(`%%${key.toUpperCase()}%%`), bannerConfig[key]);
        }
        return banner;
    }
}

/**
 * Because The-West replaces global Map variable with the in-game Map, and our dependency (tsringe) is using it.
 * We expose _Map from the script to the global scope and then we replace all usages of new Map( with new _Map(.
 *
 * @return {{name: string, renderChunk(*): *}|*}
 */
function patchMap() {
    return {
        name: 'banner',
        renderChunk(code) {
            return code.toString().replace(/new Map/g, 'new _Map');
        },
    };
}

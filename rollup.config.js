const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const pluginNodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const terser = require('rollup-plugin-terser');

const fs = require('fs');
const path = require('path');

const { version, author, contributors } = require('./package.json');

const bannerPath = path.join(__dirname, 'banner.js');
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
        file: 'dist/TW_Calc.js',
        format: 'iife',
        name: 'TW_Calc',
        sourcemap: false,
    },
    plugins: [
        pluginNodeResolve.nodeResolve({
            browser: true,
            extensions,
        }),
        commonjs({
            include: /node_modules/,
        }),
        typescript({ sourceMap: false, tsconfig: 'tsconfig.json' }),
        babel.babel({ babelHelpers: 'runtime', extensions, exclude: /node_modules/ }),
        ...(ENV === 'prod' ? [pluginTerser] : []),
        ...(ENV !== 'test' ? [banner()] : []),
    ],
};

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

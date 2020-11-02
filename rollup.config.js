import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import path from 'path';
import { version, author, contributors } from './package.json';

const bannerPath = path.join(__dirname, 'banner.js');
const bannerConfig = {
    version,
    author: [author, ...contributors].join(', '),
};

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/TW_Calc.js',
        format: 'iife',
        name: 'TW_Calc',
        sourcemap: false,
        banner: () => {
            let banner = fs.readFileSync(bannerPath, { flag: 'r', encoding: 'utf8' });
            for (let key in bannerConfig) {
                banner = banner.replace(new RegExp(`%%${key.toUpperCase()}%%`), bannerConfig[key]);
            }
            return banner;
        },
    },
    plugins: [
        commonjs({
            include: /node_modules/,
        }),
        babel({ babelHelpers: 'runtime', extensions: ['.js', '.ts'], exclude: /node_modules/ }),
    ],
};

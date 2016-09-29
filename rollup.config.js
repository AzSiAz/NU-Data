import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import { readdirSync } from 'fs';
import { join as joinPath } from 'path';

const EXTERNAL = readdirSync(joinPath(__dirname, 'node_modules'));

const ESLINT_CONFIG = {
    throwError: true,

    exclude: [
        joinPath(__dirname, '../node_modules/**'),
        joinPath(__dirname, '../package.json')
    ]
};

export default {
    external: EXTERNAL,
    entry: 'src/index.js',
    sourceMap: true,
    format: 'cjs',
    plugins: [json(), babel(), nodeResolve({ preferBuiltins: true })],
    dest: 'dist/index.js'
};
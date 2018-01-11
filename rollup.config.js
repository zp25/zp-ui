import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'legacy.js',
    output: {
      file: pkg.legacy,
      format: 'cjs',
    },
    plugins: [
      eslint(),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: false,
      }),
    ],
  },
  {
    input: 'index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        module: true,
        main: true,
      }),
      commonjs(),
      eslint(),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: false,
      }),
    ],
    // external: id => /@babel\/polyfill|core-js/.test(id),
  },
];

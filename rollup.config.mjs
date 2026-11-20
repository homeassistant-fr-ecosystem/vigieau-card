import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/vigieau-card.ts',
  output: {
    file: 'dist/vigieau-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    // Inline image assets into the final bundle so PNGs are packaged inside vigieau-card.js
    url({
      include: ['**/*.png', '**/*.jpg', '**/*.svg'],
      // Set a very large limit to always inline files as data URIs
      limit: Infinity,
      // Do not emit separate files when inlining
      emitFiles: false,
    }),
    typescript({
      declaration: false,
    }),
    json(),
    terser({
      compress: {
        drop_console: false,
      },
      output: {
        comments: false,
      },
    }),
  ],
};
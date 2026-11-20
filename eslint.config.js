import tseslint from 'typescript-eslint';
import eslintJs from '@eslint/js';

export default tseslint.config(
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
);

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
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
);

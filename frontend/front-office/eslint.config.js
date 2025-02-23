import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

const compat = new FlatCompat();

export default [
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  ...compat.config(js.configs.recommended),
  ...compat.config(react.configs.recommended),
  {
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  prettierConfig,
];

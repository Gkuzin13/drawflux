/* eslint-disable no-undef */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          'packages/shared/tsconfig.json',
          'apps/client/tsconfig.json',
          'apps/server/tsconfig.json',
        ],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-console': 'warn',
    'no-case-declarations': 'off',
    'jsx-a11y/no-autofocus': 'off',
  },
};

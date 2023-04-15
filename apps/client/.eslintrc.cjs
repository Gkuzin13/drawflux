const { getDefaultIgnorePatterns } = require('eslint-config-bases/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['eslint-config-bases/typescript', 'eslint-config-bases/react'],
  rules: {
    'no-console': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-autofocus': 'off',
  },
  overrides: [],
};

const {
  getDefaultIgnorePatterns,
} = require('@eslint-config-bases/src/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: [
    '../../packages/eslint-config-bases/src/bases/typescript',
    '../../packages/eslint-config-bases/src/bases/react',
  ],
  rules: {
    'no-console': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-autofocus': 'off',
  },
  overrides: [],
};

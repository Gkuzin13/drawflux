const {
  getDefaultIgnorePatterns,
} = require('@eslint-config-bases/src/helpers');

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: [
    '../../packages/eslint-config-bases/src/bases/typescript',
    '../../packages/eslint-config-bases/src/bases/react',
  ],
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
  },
  overrides: [],
};

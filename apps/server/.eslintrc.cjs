const { getDefaultIgnorePatterns } = require('eslint-config-bases/helpers');

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [...getDefaultIgnorePatterns(), 'src/test/setup.ts'],
  extends: ['eslint-config-bases/typescript'],
  rules: {},
  overrides: [],
};

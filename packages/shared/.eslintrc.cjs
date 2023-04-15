const {
  getDefaultIgnorePatterns,
} = require('@eslint-config-bases/src/helpers');

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['../../packages/eslint-config-bases/src/bases/typescript'],
  overrides: [],
};

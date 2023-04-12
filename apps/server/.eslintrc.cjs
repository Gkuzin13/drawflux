const {
  getDefaultIgnorePatterns,
} = require('@eslint-config-bases/src/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['../../packages/eslint-config-bases/src/bases/typescript'],
  rules: {},
  overrides: [],
};

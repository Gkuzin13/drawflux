const { getDefaultIgnorePatterns } = require('eslint-config-bases/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['eslint-config-bases/typescript'],
  overrides: [
    {
      files: ['tests/**/?(*.)+(spec|test).[jt]s'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
};

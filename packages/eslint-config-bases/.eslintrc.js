const { getDefaultIgnorePatterns } = require('./src/helpers');

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['./src/bases/typescript'],
};

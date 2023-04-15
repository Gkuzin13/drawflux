const getDefaultIgnorePatterns = () => {
  return [
    '**/node_modules',
    '**/build',
    '**/dist',
    '**/public',
    '.eslintrc.cjs',
    '.eslintrc.js',
    '*.config.ts',
    'vite-env.d.ts',
  ];
};

module.exports = { getDefaultIgnorePatterns };

const getDefaultIgnorePatterns = () => {
  return [
    '**/node_modules',
    '**/build',
    '**/dist',
    '**/public',
    'vite-env.d.ts',
    'vite.config.ts',
  ];
};

module.exports = { getDefaultIgnorePatterns };

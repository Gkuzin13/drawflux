import { defineConfig } from 'vitest/config';

const testFiles = ['./**/*.test.{js,jsx,ts,tsx}'];

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'clover'],
      extension: ['js', 'ts'],
    },
    include: testFiles,
    // To mimic Jest behaviour regarding mocks.
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    exclude: ['**/node_modules/**'],
  },
});

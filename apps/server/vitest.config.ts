import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'clover'],
      extension: ['js', 'ts'],
    },
    include: ['./**/*.test.{js,jsx,ts,tsx}'],
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    exclude: ['**/node_modules/**'],
  },
});

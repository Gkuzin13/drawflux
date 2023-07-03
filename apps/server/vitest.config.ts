import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'clover'],
      extension: ['js', 'ts'],
    },
    deps: {
      inline: [/shared/],
    },
    include: ['./src/**/*.test.{js,ts}'],
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    exclude: ['**/node_modules/**'],
  },
});

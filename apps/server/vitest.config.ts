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
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: [
        'src/features/**/*',
        'src/loaders/**/*',
        'src/middlewares/**/*',
        'src/routes/**/*',
        'src/utils/**/*',
        'src/services/**/*',
      ],
      extension: ['.ts', '.tsx'],
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

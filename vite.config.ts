/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@/types/': new URL('./types/', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    setupFiles: ['./src/client/test/setup.ts'],
    environment: 'jsdom',
  },
});

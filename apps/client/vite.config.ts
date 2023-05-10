/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5174 },
  plugins: [react()],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    environment: 'jsdom',
    deps: {
      // Temporary workaround
      // Otherwise throws "ERR_MODULE_NOT_FOUND"
      registerNodeLoader: true,
    },
  },
  optimizeDeps: {
    include: ['shared'],
  },
  build: {
    commonjsOptions: {
      include: [/shared/, /node_modules/],
    },
  },
});

/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@shared': new URL('node_modules/@shared', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    environment: 'jsdom',
    deps: {
      // Temporary workaround
      // Otherwise throws "ERR_MODULE_NOT_FOUND"
      registerNodeLoader: true,
    },
  },
});

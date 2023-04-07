/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      // Temporary workaround
      // Referencing local workspace package isn't working, https://pnpm.io/workspaces#referencing-workspace-packages-through-aliases
      '@shared': new URL('../../packages/shared/dist/', import.meta.url)
        .pathname,
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

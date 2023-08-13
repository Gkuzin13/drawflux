import { defineProject } from 'vitest/dist/config';

export default defineProject({
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});

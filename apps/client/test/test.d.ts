import 'vitest';
import { type TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-interface
    interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  }
}

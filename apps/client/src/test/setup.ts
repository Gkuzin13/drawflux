import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import 'vitest-canvas-mock';

/**
 * temporary fix for tests that use jest-canvas-mock
 * throws this error: ReferenceError: jest is not defined
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.jest = vi;

afterEach(() => {
  cleanup();
});

expect.extend(matchers);

global.ResizeObserver = ResizeObserverPolyfill;

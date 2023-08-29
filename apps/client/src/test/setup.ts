import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import 'vitest-canvas-mock';
import { localStorage, matchMedia } from './browser-mocks';

afterEach(() => {
  cleanup();
});

/**
 * temporary fix for tests that use jest-canvas-mock
 * otherwise throws error
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.jest = vi;

global.ResizeObserver = ResizeObserverPolyfill;
global.matchMedia = matchMedia;
global.localStorage = localStorage;

expect.extend(matchers);

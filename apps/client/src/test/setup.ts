import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import 'vitest-canvas-mock';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

global.ResizeObserver = ResizeObserverPolyfill;

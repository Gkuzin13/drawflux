import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import './browser-mocks';
import 'vitest-canvas-mock';
import { server } from './mocks/server';

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.history.replaceState({}, '', window.origin);
});

afterAll(() => server.close());

/**
 * temporary fix for tests that use jest-canvas-mock
 * otherwise throws error
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.jest = vi;

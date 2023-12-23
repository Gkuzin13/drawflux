import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import 'vitest-canvas-mock';
import { localStorage, matchMedia } from './browser-mocks';

expect.extend(matchers);

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

/**
 * mock document.fonts load
 */
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) },
  configurable: true,
});

/**
 * implement missing DragEvent in jsdom 
 * https://github.com/jsdom/jsdom/issues/2913
 */
class DragEvent extends MouseEvent {
  public clientX: number;
  public clientY: number;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.clientX = params.clientX ?? 0;
    this.clientY = params.clientY ?? 0;
  }
}

global.DragEvent =
  global.DragEvent ?? (DragEvent as typeof globalThis.PointerEvent);

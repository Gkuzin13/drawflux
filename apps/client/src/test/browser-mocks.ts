import ResizeObserverPolyfill from 'resize-observer-polyfill';

// matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// localStorage
Object.defineProperty(window, 'localStorage', {
  value: vi.fn().mockImplementation(() => {
    let storage: Record<string, string> = {};

    return {
      getItem: (key: string) => storage[key],
      setItem: (key: string, value: string) => (storage[key] = value),
      clear: () => (storage = {}),
      removeItem: (key: string) => delete storage[key],
      length: Object.keys(storage).length,
      key: (index: number) => Object.keys(storage)[index] || null,
    };
  })(),
});

/**
 * implement missing DragEvent in jsdom
 * https://github.com/jsdom/jsdom/issues/2913
 */
export class DragEvent extends MouseEvent {
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

// fonts load
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) },
  configurable: true,
});

// resizeObserver
global.ResizeObserver = ResizeObserverPolyfill;

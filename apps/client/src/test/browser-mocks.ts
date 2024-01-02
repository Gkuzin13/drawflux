export const matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

export const localStorage = vi.fn(() => {
  let storage: Record<string, string> = {};
  
  return {
    getItem: (key: string) => storage[key],
    setItem: (key: string, value: string) => (storage[key] = value),
    clear: () => (storage = {}),
    removeItem: (key: string) => delete storage[key],
    length: Object.keys(storage).length,
    key: (index: number) => Object.keys(storage)[index] || null,
  };
})();

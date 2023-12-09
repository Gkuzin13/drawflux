export type Key = (typeof KEYS)[keyof typeof KEYS];

export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  DELETE: 'Delete',
  CTRL: 'ctrlKey',
  SHIFT: 'shiftKey',
  C: 'c',
  H: 'h',
  R: 'r',
  D: 'd',
  O: 'o',
  A: 'a',
  P: 'p',
  T: 't',
  V: 'v',
  Z: 'z',
  L: 'l',
} as const;

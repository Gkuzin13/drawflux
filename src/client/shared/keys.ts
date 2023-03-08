import { Tool } from './tool';

export type Key = (typeof KEYS)[keyof typeof KEYS];

export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  DELETE: 'Delete',
  CTRL: 'ctrlKey',
  SHIFT: 'shiftKey',
  H: 'h',
  R: 'r',
  D: 'd',
  O: 'o',
  A: 'a',
  P: 'p',
  T: 't',
  V: 'v',
  Z: 'z',
} as const;

export const CTRL_KEY = 'ctrlKey';

import type { HistoryActionKey } from '@/stores/reducers/history';
import { type canvasActions } from '@/stores/slices/canvas';
import { KEYS, type Key } from '../keys';
import type { Entity } from '@/constants/index';

type Control = Entity<HistoryActionKey | keyof typeof canvasActions> & {
  key: string;
  modifierKeys: readonly Key[];
};

export const CONTROL: readonly Control[] = [
  {
    name: 'Undo',
    value: 'undo',
    icon: 'arrowBackUp',
    key: 'Z',
    modifierKeys: [KEYS.CTRL],
  },
  {
    name: 'Redo',
    value: 'redo',
    icon: 'arrowForwardUp',
    key: 'Z',
    modifierKeys: [KEYS.CTRL, KEYS.SHIFT],
  },
  {
    name: 'Delete',
    value: 'deleteNodes',
    icon: 'trash',
    key: 'Del',
    modifierKeys: [],
  },
] as const;

import type { HistoryActionKey } from '@/stores/reducers/history';
import { type canvasActions } from '@/services/canvas/slice';
import type { ShortcutKeyCombo } from '@/constants/index';

type Control = ShortcutKeyCombo<HistoryActionKey | keyof typeof canvasActions>;

export const CONTROL: readonly Control[] = [
  {
    name: 'Undo',
    value: 'undo',
    icon: 'arrowBackUp',
    key: 'Z',
    modifierKeys: ['Ctrl'],
  },
  {
    name: 'Redo',
    value: 'redo',
    icon: 'arrowForwardUp',
    key: 'Z',
    modifierKeys: ['Ctrl', 'Shift'],
  },
  {
    name: 'Delete',
    value: 'deleteNodes',
    icon: 'trash',
    key: 'Del',
    modifierKeys: [],
  },
] as const;

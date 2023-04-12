import {
  IoArrowUndoOutline,
  IoArrowRedoOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { historyActions } from '@/stores/slices/historySlice';
import { nodesActions } from '@/stores/slices/nodesSlice';
import { KEYS } from './keys.js';

export type ControlValue = (typeof CONTROL)[number]['value'];

export const CONTROL = [
  {
    name: 'Undo',
    value: historyActions.undo(),
    icon: IoArrowUndoOutline,
    key: KEYS.Z,
    modifierKeys: [KEYS.CTRL],
  },
  {
    name: 'Redo',
    value: historyActions.redo(),
    icon: IoArrowRedoOutline,
    key: KEYS.Z,
    modifierKeys: [KEYS.CTRL, KEYS.SHIFT],
  },
  {
    name: 'Clear',
    value: nodesActions.deleteAll(),
    icon: IoTrashOutline,
    key: KEYS.C,
    modifierKeys: [KEYS.CTRL],
  },
] as const;

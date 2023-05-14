import {
  IoArrowUndoOutline,
  IoArrowRedoOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions } from '@/stores/slices/canvas';
import { KEYS } from './keys.js';

export type ControlAction = (typeof CONTROL)[number]['value'];

export const CONTROL = [
  {
    name: 'Undo',
    value: historyActions.undo,
    icon: IoArrowUndoOutline,
    key: KEYS.Z,
    modifierKeys: [KEYS.CTRL],
  },
  {
    name: 'Redo',
    value: historyActions.redo,
    icon: IoArrowRedoOutline,
    key: KEYS.Z,
    modifierKeys: [KEYS.CTRL, KEYS.SHIFT],
  },
  {
    name: 'Delete',
    value: canvasActions.deleteNodes,
    icon: IoTrashOutline,
    key: KEYS.C,
    modifierKeys: [KEYS.CTRL],
  },
] as const;

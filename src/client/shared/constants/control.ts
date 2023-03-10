import { historyActions } from '@/client/stores/slices/historySlice';
import { nodesActions } from '@/client/stores/slices/nodesSlice';
import {
  IoArrowUndoOutline,
  IoArrowRedoOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { KEYS } from './keys';

export type ControlValue = (typeof CONTROL)[number]['value'];

export const CONTROL = [
  {
    name: 'Undo',
    value: historyActions.undo.type,
    icon: IoArrowUndoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL],
  },
  {
    name: 'Redo',
    value: historyActions.redo.type,
    icon: IoArrowRedoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL, KEYS.SHIFT],
  },
  {
    name: 'Clear',
    value: nodesActions.deleteAll().type,
    icon: IoTrashOutline,
    key: KEYS.C,
    KeyCombo: [KEYS.CTRL],
  },
] as const;

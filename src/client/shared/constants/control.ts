import { ACTION_TYPES } from '@/client/stores/actions';
import {
  IoArrowUndoOutline,
  IoArrowRedoOutline,
  IoTrash,
} from 'react-icons/io5';
import { KEYS } from './keys';

export const CONTROL = [
  {
    value: ACTION_TYPES.UNDO,
    icon: IoArrowUndoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL],
  },
  {
    value: ACTION_TYPES.REDO,
    icon: IoArrowRedoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL, KEYS.SHIFT],
  },
  {
    value: 'clear',
    icon: IoTrash,
    key: KEYS.C,
    KeyCombo: [KEYS.CTRL],
  },
] as const;

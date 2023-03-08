import { IoArrowUndoOutline, IoArrowRedoOutline } from 'react-icons/io5';
import { KEYS } from './keys';

export const HISTORY = [
  {
    value: 'undo',
    icon: IoArrowUndoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL],
  },
  {
    value: 'redo',
    icon: IoArrowRedoOutline,
    key: KEYS.Z,
    KeyCombo: [KEYS.CTRL, KEYS.SHIFT],
  },
];

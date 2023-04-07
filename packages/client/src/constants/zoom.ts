import { stageConfigActions } from '@/stores/slices/stageConfigSlice';
import { IoAdd, IoRemove } from 'react-icons/io5';

export type ZoomValue = (typeof ZOOM)[keyof typeof ZOOM]['value'];

export const ZOOM = {
  IN: {
    name: 'Zoom In',
    value: stageConfigActions.scaleIncrease(),
    icon: IoAdd,
  },
  OUT: {
    name: 'Zoom Out',
    value: stageConfigActions.scaleDecrease(),
    icon: IoRemove,
  },
  RESET: {
    name: 'Reset Zoom',
    value: stageConfigActions.scaleReset(),
  },
} as const;

import { IoAdd, IoRemove } from 'react-icons/io5';

export type ZoomAction = (typeof ZOOM)[keyof typeof ZOOM]['value'];

export const ZOOM = {
  IN: {
    name: 'Zoom In',
    value: 'increase',
    icon: IoAdd,
  },
  OUT: {
    name: 'Zoom Out',
    value: 'decrease',
    icon: IoRemove,
  },
  RESET: {
    name: 'Reset Zoom',
    value: 'reset',
  },
} as const;

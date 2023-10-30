import type { Entity, ShortcutKeyCombo } from '../index';

export type ZoomAction = (typeof ZOOM)[keyof typeof ZOOM]['value'];

type Zoom = {
  in: ShortcutKeyCombo;
  out: ShortcutKeyCombo;
  reset: Omit<Entity, 'icon'>;
};

export const ZOOM: Zoom = {
  in: {
    name: 'Zoom In',
    value: 'increase',
    icon: 'plus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel++'],
  },
  out: {
    name: 'Zoom Out',
    value: 'decrease',
    icon: 'minus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel--'],
  },
  reset: {
    name: 'Reset Zoom',
    value: 'reset',
  },
};

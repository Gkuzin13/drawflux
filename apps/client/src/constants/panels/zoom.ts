import type { Entity, ShortcutKeyCombo } from '../index';

export type ZoomAction = Zoom[keyof Zoom]['value'];

type Zoom = {
  in: ShortcutKeyCombo<'in'>;
  out: ShortcutKeyCombo<'out'>;
  reset: Omit<Entity<'reset'>, 'icon'>;
};

export const ZOOM: Zoom = {
  in: {
    name: 'Zoom In',
    value: 'in',
    icon: 'plus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel++'],
  },
  out: {
    name: 'Zoom Out',
    value: 'out',
    icon: 'minus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel--'],
  },
  reset: {
    name: 'Reset Zoom',
    value: 'reset',
  },
} as const;

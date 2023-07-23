import type { Entity } from '../index';

export type ZoomAction = (typeof ZOOM)[keyof typeof ZOOM]['value'];

type Zoom = {
  in: Entity;
  out: Entity;
  reset: Omit<Entity, 'icon'>;
};

export const ZOOM: Zoom = {
  in: {
    name: 'Zoom In',
    value: 'increase',
    icon: 'plus',
  },
  out: {
    name: 'Zoom Out',
    value: 'decrease',
    icon: 'minus',
  },
  reset: {
    name: 'Reset Zoom',
    value: 'reset',
  },
};

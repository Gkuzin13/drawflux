import { KEYS } from '@/constants/keys';
import type { Entity } from '@/constants/index';
import type { AppState } from '../app';

export type Tool = Entity<ToolType> & {
  key: (typeof KEYS)[keyof typeof KEYS];
};

export type ToolType = AppState['page']['toolType'];

export const TOOLS: readonly Tool[] = [
  {
    name: 'Select',
    value: 'select',
    icon: 'pointer',
    key: KEYS.V,
  },
  {
    name: 'Hand',
    icon: 'handStop',
    value: 'hand',
    key: KEYS.H,
  },
  {
    name: 'Arrow',
    value: 'arrow',
    icon: 'arrowUpRight',
    key: KEYS.A,
  },
  {
    name: 'Ellipse',
    value: 'ellipse',
    icon: 'circle',
    key: KEYS.O,
  },
  {
    name: 'Rectangle',
    value: 'rectangle',
    icon: 'square',
    key: KEYS.R,
  },
  {
    name: 'Draw',
    value: 'draw',
    icon: 'scribble',
    key: KEYS.P,
  },
  {
    name: 'Text',
    value: 'text',
    icon: 'text',
    key: KEYS.T,
  },
  {
    name: 'Laser',
    value: 'laser',
    icon: 'laser',
    key: KEYS.L,
  },
] as const;

import type { NodeLine, NodeSize, NodeFill } from 'shared';
import { Schemas } from 'shared';
import type { Entity } from '@/constants/index';

export const LINE: Entity<NodeLine>[] = [
  {
    value: 'solid',
    name: 'Solid',
    icon: 'minus',
  },
  {
    value: 'dashed',
    name: 'Dashed',
    icon: 'lineDashed',
  },
  {
    value: 'dotted',
    name: 'Dotted',
    icon: 'lineDotted',
  },
];

export const FILL: Entity<NodeFill>[] = [
  {
    value: 'none',
    name: 'None',
    icon: 'filledNone',
  },
  {
    value: 'semi',
    name: 'Semi',
    icon: 'filledSemi',
  },
  {
    value: 'solid',
    name: 'Solid',
    icon: 'filledSolid',
  },
];

export const OPACITY = {
  minValue: Schemas.Node.shape.style.shape.opacity.minValue || 0.2,
  maxValue: Schemas.Node.shape.style.shape.opacity.maxValue || 1,
  step: 0.1,
} as const;

export const ANIMATED = {
  name: 'Animated',
  value: 'animated',
} as const;

export const SIZE: Entity<NodeSize>[] = [
  {
    value: 'small',
    name: 'Small',
    icon: 'letterS',
  },
  {
    value: 'medium',
    name: 'Medium',
    icon: 'letterM',
  },
  {
    value: 'large',
    name: 'Large',
    icon: 'letterL',
  },
  {
    value: 'extra-large',
    name: 'Extra Large',
    icon: 'extraLarge',
  },
];

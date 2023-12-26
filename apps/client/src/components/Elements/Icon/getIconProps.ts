import type { IconProps } from './Icon';

export const SIZE = {
  xs: 12,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

export const STROKE = {
  sm: 1.5,
  md: 1.75,
  lg: 2,
  xl: 2.5,
} as const;

export function getIconSize(value: IconProps['size']) {
  return SIZE[value ?? 'md'];
}

export function getIconStrokeWidth(value: IconProps['stroke']) {
  return typeof value === 'number' ? value : STROKE[value ?? 'md'];
}

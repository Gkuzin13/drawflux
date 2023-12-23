import type Checkbox from './Checkbox';
import type { IconProps } from '../Icon/Icon';
import type { ComponentProps } from 'react';

type CheckBoxSizeProp = ComponentProps<typeof Checkbox>['size'];

export function getIconProps(
  size: CheckBoxSizeProp,
): Partial<IconProps> {
  switch (size) {
    case 'sm':
      return { size: 'xs', stroke: 'xl' };
    case 'md':
      return { size: 'sm' };
    default:
      return { size: 'sm' };
  }
}

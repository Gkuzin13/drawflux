import { colors } from '../styles/theme';
import IconSizeStyle from '@/client/components/icons/IconSizeStyle';
import IconAnimatedStyle from '@/client/components/icons/IconAnimatedStyle';
import IconLineSolid from '@/client/components/icons/IconLineSolid';
import IconLineDashed from '@/client/components/icons/IconLineDashed';
import IconLineDotted from '@/client/components/icons/IconLineDotted';

export const LINE = [
  {
    value: [0, 0],
    name: 'solid',
    icon: IconLineSolid,
  },
  {
    value: [16, 12],
    name: 'dashed',
    icon: IconLineDashed,
  },
  {
    value: [1, 12],
    name: 'dotted',
    icon: IconLineDotted,
  },
] as const;

export const ANIMATED = {
  name: 'animated',
  value: 'animated',
  icon: IconAnimatedStyle,
} as const;

export const SIZE = [
  {
    value: 2,
    name: 'small',
    icon: IconSizeStyle,
  },
  {
    value: 4,
    name: 'medium',
    icon: IconSizeStyle,
  },
  {
    value: 6,
    name: 'large',
    icon: IconSizeStyle,
  },
  {
    value: 8,
    name: 'extra large',
    icon: IconSizeStyle,
  },
] as const;

export const COLOR = [
  { name: 'red', value: colors.red600 },
  { name: 'pink', value: colors.pink600 },
  { name: 'deep orange', value: colors['deep-orange600'] },
  { name: 'yellow', value: colors.yellow600 },
  { name: 'green', value: colors.green600 },
  { name: 'teal', value: colors.teal600 },
  { name: 'light blue', value: colors['light-blue600'] },
  { name: 'blue', value: colors.blue600 },
  { name: 'deep purple', value: colors['deep-purple600'] },
  { name: 'indigo', value: colors.indigo600 },
  { name: 'black', value: colors.black },
  { name: 'gray', value: colors.gray600 },
] as const;

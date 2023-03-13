import { theme } from '../styles/theme';
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
};

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
  { name: 'red', value: theme.colors.red600.value },
  { name: 'pink', value: theme.colors.pink600.value },
  { name: 'deep orange', value: theme.colors['deep-orange600'].value },
  { name: 'yellow', value: theme.colors.yellow600.value },
  { name: 'green', value: theme.colors.green600.value },
  { name: 'teal', value: theme.colors.teal600.value },
  { name: 'light blue', value: theme.colors['light-blue600'].value },
  { name: 'blue', value: theme.colors.blue600.value },
  { name: 'deep purple', value: theme.colors['deep-purple600'].value },
  { name: 'indigo', value: theme.colors.indigo600.value },
  { name: 'black', value: theme.colors.black.value },
  { name: 'gray', value: theme.colors.gray600.value },
] as const;

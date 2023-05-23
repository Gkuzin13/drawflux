import type { IconBaseProps } from 'react-icons';
import { TbLineDashed, TbLineDotted, TbMinus } from 'react-icons/tb';
import { colors } from 'shared';

export const LINE = [
  {
    value: 'solid',
    name: 'Solid',
    icon: TbMinus,
  },
  {
    value: 'dashed',
    name: 'Dashed',
    icon: TbLineDashed,
  },
  {
    value: 'dotted',
    name: 'Dotted',
    icon: TbLineDotted,
  },
] as const;

export const ANIMATED = {
  name: 'animated',
  value: 'animated',
} as const;

const SizeIcon = (props: IconBaseProps) => {
  return TbMinus({ transform: 'rotate(-45)', ...props });
};

export const SIZE = [
  {
    value: 2,
    name: 'small',
    icon: (props: IconBaseProps) => SizeIcon({ strokeWidth: 2, ...props }),
  },
  {
    value: 4,
    name: 'medium',
    icon: (props: IconBaseProps) => SizeIcon({ strokeWidth: 4, ...props }),
  },
  {
    value: 6,
    name: 'large',
    icon: (props: IconBaseProps) => SizeIcon({ strokeWidth: 6, ...props }),
  },
  {
    value: 8,
    name: 'extra large',
    icon: (props: IconBaseProps) => SizeIcon({ strokeWidth: 8, ...props }),
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

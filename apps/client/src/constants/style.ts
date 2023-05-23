import type { IconBaseProps, IconType } from 'react-icons';
import {
  TbCircleFilled,
  TbLineDashed,
  TbLineDotted,
  TbMinus,
  TbSlash,
} from 'react-icons/tb';
import type { NodeLine, NodeSize, NodeColor } from 'shared';

type StyleConst<V> = {
  value: V;
  name: string;
  icon: IconType;
};

export const LINE: StyleConst<NodeLine>[] = [
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
];

export const ANIMATED = {
  name: 'animated',
  value: 'animated',
} as const;

export const SIZE: StyleConst<NodeSize>[] = [
  {
    value: 'small',
    name: 'Small',
    icon: (props: IconBaseProps) => TbSlash({ strokeWidth: 2, ...props }),
  },
  {
    value: 'medium',
    name: 'Medium',
    icon: (props: IconBaseProps) => TbSlash({ strokeWidth: 4, ...props }),
  },
  {
    value: 'large',
    name: 'Large',
    icon: (props: IconBaseProps) => TbSlash({ strokeWidth: 6, ...props }),
  },
  {
    value: 'extra-large',
    name: 'Extra Large',
    icon: (props: IconBaseProps) => TbSlash({ strokeWidth: 8, ...props }),
  },
];

export const COLOR: StyleConst<NodeColor>[] = [
  { name: 'Red', value: 'red600' },
  { name: 'Pink', value: 'pink600' },
  { name: 'Deep Orange', value: 'deep-orange600' },
  { name: 'Yellow', value: 'yellow600' },
  { name: 'Green', value: 'green600' },
  { name: 'Teal', value: 'teal600' },
  { name: 'Light Blue', value: 'light-blue600' },
  { name: 'Blue', value: 'blue600' },
  { name: 'Deep Purple', value: 'deep-purple600' },
  { name: 'Indigo', value: 'indigo600' },
  { name: 'Black', value: 'black' },
  { name: 'Gray', value: 'gray600' },
].map((color) => {
  return { ...color, icon: TbCircleFilled };
}) as StyleConst<NodeColor>[];

import {
  TbLineDashed,
  TbMinus,
  TbLineDotted,
  TbLetterS,
  TbLetterM,
  TbLetterL,
  TbLetterX,
} from 'react-icons/tb';
import { HiOutlineFilm } from 'react-icons/hi2';
import { IconType } from 'react-icons';
import { themeColors } from '../styles/theme';

export type StyleObj<T> = {
  value: T;
  name: string;
  icon: IconType;
};

const LINE = [
  {
    value: [0, 0],
    name: 'solid',
    icon: TbMinus,
  },
  {
    value: [16, 12],
    name: 'dashed',
    icon: TbLineDashed,
  },
  {
    value: [1, 12],
    name: 'dotted',
    icon: TbLineDotted,
  },
] as const;

const ANIMATED: StyleObj<string> = {
  name: 'animated',
  value: 'animated',
  icon: HiOutlineFilm,
};

const SIZE: StyleObj<number>[] = [
  {
    value: 2,
    name: 'small',
    icon: TbLetterS,
  },
  {
    value: 4,
    name: 'medium',
    icon: TbLetterM,
  },
  {
    value: 6,
    name: 'large',
    icon: TbLetterL,
  },
  {
    value: 8,
    name: 'extra large',
    icon: TbLetterX,
  },
];

const COLOR = [
  {
    name: 'red',
    value: themeColors.red600,
  },
  {
    name: 'pink',
    value: themeColors.pink600,
  },
  {
    name: 'deep orange',
    value: themeColors['deep-orange600'],
  },
  {
    name: 'yellow',
    value: themeColors.yellow600,
  },
  { name: 'green', value: themeColors.green600 },
  {
    name: 'teal',
    value: themeColors.teal600,
  },
  {
    name: 'light blue',
    value: themeColors['light-blue600'],
  },
  {
    name: 'blue',
    value: themeColors.blue600,
  },
  {
    name: 'deep purple',
    value: themeColors['deep-purple600'],
  },
  {
    name: 'indigo',
    value: themeColors.indigo600,
  },
  {
    name: 'black',
    value: themeColors.black,
  },
  {
    name: 'gray',
    value: themeColors.gray600,
  },
] as const;

export { LINE, SIZE, COLOR, ANIMATED };

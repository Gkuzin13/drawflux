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
import { theme } from '../styles/theme';

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

export { LINE, SIZE, COLOR, ANIMATED };

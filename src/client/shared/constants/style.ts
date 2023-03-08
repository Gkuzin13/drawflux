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

export type StyleObj<T> = {
  value: T;
  name: string;
  icon: IconType;
};

const LINE: StyleObj<number[]>[] = [
  {
    value: [0, 0],
    name: 'Solid',
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
];

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
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'black',
  'white',
  'teal',
] as const;

export { LINE, SIZE, COLOR, ANIMATED };

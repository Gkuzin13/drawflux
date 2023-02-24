import { TbLineDashed, TbMinus, TbLineDotted } from 'react-icons/tb';
import { HiOutlineFilm } from 'react-icons/hi2';

const LINE = {
  SOLID: {
    icon: TbMinus,
    value: 'solid',
  },
  DASHED: {
    icon: TbLineDashed,
    value: 'dashed',
  },
  DOTTED: {
    value: 'dotted',
    icon: TbLineDotted,
  },
} as const;

const ANIMATED = {
  value: 'animated',
  icon: HiOutlineFilm,
};

const SIZE = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra large',
} as const;

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

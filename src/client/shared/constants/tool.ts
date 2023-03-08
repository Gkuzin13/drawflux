import { KEYS } from './keys';
import {
  IoEllipseOutline,
  IoSquareOutline,
  IoHandRightOutline,
} from 'react-icons/io5';
import { RxCursorArrow } from 'react-icons/rx';
import { IconType } from 'react-icons';
import { ELEMENTS } from './element';
import { TbArrowUpRight, TbScribble, TbTypography } from 'react-icons/tb';

export type Tool = {
  icon: IconType;
  value: (typeof ELEMENTS)[keyof typeof ELEMENTS] | 'hand' | 'select';
  key: (typeof KEYS)[keyof typeof KEYS];
};

export const TOOLS: Tool[] = [
  {
    icon: RxCursorArrow,
    value: 'select',
    key: KEYS.V,
  },
  {
    icon: IoHandRightOutline,
    value: 'hand',
    key: KEYS.H,
  },
  {
    icon: IoEllipseOutline,
    value: 'ellipse',
    key: KEYS.O,
  },
  {
    icon: IoSquareOutline,
    value: 'rectangle',
    key: KEYS.R,
  },
  {
    icon: TbArrowUpRight,
    value: 'arrow',
    key: KEYS.A,
  },
  {
    icon: TbScribble,
    value: 'draw',
    key: KEYS.P,
  },
  {
    icon: TbTypography,
    value: 'text',
    key: KEYS.T,
  },
];

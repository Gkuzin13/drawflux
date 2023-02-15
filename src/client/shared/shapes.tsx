import { KEYS } from './keys';
import {
  IoEllipseOutline,
  IoSquareOutline,
  IoReturnUpForwardOutline,
  IoPencilOutline,
  IoTextOutline,
} from 'react-icons/io5';

export const SHAPES = [
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
    icon: IoReturnUpForwardOutline,
    value: 'arrow',
    key: KEYS.A,
  },
  {
    icon: IoPencilOutline,
    value: 'draw',
    key: KEYS.P,
  },
  {
    icon: IoTextOutline,
    value: 'text',
    key: KEYS.T,
  },
] as const;

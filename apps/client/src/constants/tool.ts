import { KEYS } from './keys';
import {
  IoEllipseOutline,
  IoSquareOutline,
  IoHandRightOutline,
} from 'react-icons/io5';
import { RxCursorArrow } from 'react-icons/rx';
import { IconType } from 'react-icons';
import { TbArrowUpRight, TbScribble, TbTypography } from 'react-icons/tb';
import { Schemas } from '@shared';
import { z } from 'zod';

export type Tool = {
  icon: IconType;
  value: z.infer<typeof ToolType>;
  key: (typeof KEYS)[keyof typeof KEYS];
};

const NodeType = Schemas.Node.shape.type.options;

export const ToolType = z.union([
  ...NodeType,
  z.literal('hand'),
  z.literal('select'),
]);

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
    icon: TbArrowUpRight,
    value: 'arrow',
    key: KEYS.A,
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

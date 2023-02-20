import ArrowDrawable from '@/client/components/ArrowDrawable/ArrowDrawable';
import EllipseDrawable from '@/client/components/EllipseDrawable';
import RectDrawable from '@/client/components/RectDrawable';
import FreePathDrawable from '@/client/components/FreePathDrawable';
import EditableText from '@/client/components/EditableText/EditableText';
import { SimpleColors } from '@nextui-org/react';
import { COLOR, LINE, SIZE } from './style';

export const ELEMENTS = {
  ARROW: 'arrow',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  DRAW: 'draw',
  TEXT: 'text',
} as const;

export const getElement = (element: NodeType) => {
  switch (element.type) {
    case 'arrow':
      return ArrowDrawable;
    case 'rectangle':
      return RectDrawable;
    case 'ellipse':
      return EllipseDrawable;
    case 'draw':
      return FreePathDrawable;
    case 'text':
      return EditableText;
  }
};

export const getSizeValue = (size: NodeSize) => {
  switch (size) {
    case 'small':
      return 2;
    case 'medium':
      return 4;
    case 'large':
      return 6;
    case 'extra large':
      return 8;
    default:
      return 2;
  }
};

export const getLineValue = (size: NodeLIne) => {
  switch (size) {
    case 'solid':
      return [];
    case 'dotted':
      return [1, 12];
    case 'dashed':
      return [16, 12];
    default:
      return [];
  }
};

export const getStyleValues = (style: NodeStyle) => {
  const dash = getLineValue(style.line);
  const strokeWidth = getSizeValue(style.size);

  return { dash, strokeWidth };
};

export type ElementType = (typeof ELEMENTS)[keyof typeof ELEMENTS];

export type NodeType = {
  type: ElementType;
  nodeProps: NodeProps;
  text: string | null;
  style: NodeStyle;
};

export type NodeProps = {
  id: string;
  points: Point[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
};

export type NodeStyle = {
  color: NodeColor;
  line: NodeLIne;
  size: NodeSize;
  animated?: boolean;
};

export type NodeLIne = (typeof LINE)[keyof typeof LINE];
export type NodeColor = (typeof COLOR)[keyof typeof COLOR];
export type NodeSize = (typeof SIZE)[keyof typeof SIZE];

export type Point = {
  x: number;
  y: number;
};

export type MenuItem = {
  key: string;
  name: string;
  color: SimpleColors;
};

import ArrowDrawable from '@/client/components/ArrowDrawable/ArrowDrawable';
import EllipseDrawable from '@/client/components/EllipseDrawable/EllipseDrawable';
import RectDrawable from '@/client/components/RectDrawable/RectDrawable';
import FreePathDrawable from '@/client/components/FreePathDrawable/FreePathDrawable';
import EditableText from '@/client/components/EditableText/EditableText';
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
  point: Point;
  points?: Point[];
  width?: number;
  height?: number;
  rotation: number;
  visible: boolean;
};

export type NodeStyle = {
  color: NodeColor;
  line: NodeLIne;
  size: NodeSize;
  animated?: boolean;
};

export type NodeLIne = (typeof LINE)[keyof typeof LINE]['value'];
export type NodeColor = (typeof COLOR)[number];
export type NodeSize = (typeof SIZE)[keyof typeof SIZE];

export type Point = [number, number];

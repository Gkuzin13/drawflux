import ArrowDrawable from '@/client/components/ArrowDrawable/ArrowDrawable';
import EllipseDrawable from '@/client/components/EllipseDrawable/EllipseDrawable';
import RectDrawable from '@/client/components/RectDrawable/RectDrawable';
import FreePathDrawable from '@/client/components/FreePathDrawable/FreePathDrawable';
import EditableText from '@/client/components/EditableText/EditableText';
import { COLOR, LINE, SIZE } from './style';
import { NodeConfig } from 'konva/lib/Node';
import { ShapeConfig } from 'konva/lib/Shape';

export const ELEMENTS = {
  ARROW: 'arrow',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  DRAW: 'draw',
  TEXT: 'text',
} as const;

export const getElement = (element: NodeType['type']) => {
  switch (element) {
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

export const createDefaultNodeConfig = ({
  visible,
  strokeWidth,
  stroke,
  id,
  rotation,
  draggable,
  dash,
  ...rest
}: NodeConfig & ShapeConfig): NodeConfig & ShapeConfig => {
  return {
    lineCap: 'round',
    strokeScaleEnabled: false,
    perfectDrawEnabled: false,
    shadowForStrokeEnabled: false,
    hitStrokeWidth: 12,
    fillEnabled: false,
    opacity: 1,
    visible,
    strokeWidth,
    stroke,
    id,
    rotation,
    draggable,
    dash,
    ...rest,
  };
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
  bend?: number;
};

export type NodeStyle = {
  color: NodeColor;
  line: NodeLIne;
  size: NodeSize;
  animated?: boolean;
  opacity?: number;
};

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }; // temporary fix

export type NodeLIne = Writeable<(typeof LINE)[number]['value']>;
export type NodeSize = (typeof SIZE)[number]['value'];
export type NodeColor = (typeof COLOR)[number]['value'];

export type Point = [number, number];

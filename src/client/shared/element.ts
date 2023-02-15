import ArrowDrawable from '@/client/components/ArrowDrawable';
import CircleDrawable from '@/client/components/CircleDrawable';
import RectDrawable from '@/client/components/RectDrawable';
import FreePathDrawable from '@/client/components/FreePathDrawable';
import EditableText from '@/client/components/EditableText';
import { SimpleColors } from '@nextui-org/react';

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
      return CircleDrawable;
    case 'draw':
      return FreePathDrawable;
    case 'text':
      return EditableText;
  }
};

export type NodeType = {
  type: (typeof ELEMENTS)[keyof typeof ELEMENTS];
  nodeProps: NodeProps;
  text: string | null;
};

export type DrawableNode = Node;

export type Point = {
  x: number;
  y: number;
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

export type MenuItem = {
  key: string;
  name: string;
  color: SimpleColors;
};

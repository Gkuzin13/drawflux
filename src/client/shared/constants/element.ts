import { z } from 'zod';
import ArrowDrawable from '@/client/components/shapes/ArrowDrawable/ArrowDrawable';
import EditableText from '@/client/components/shapes/EditableText/EditableText';
import EllipseDrawable from '@/client/components/shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/client/components/shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/client/components/shapes/RectDrawable/RectDrawable';
import { NodeConfig } from 'konva/lib/Node';
import { ShapeConfig } from 'konva/lib/Shape';
import {
  NodePropsSchema,
  NodeStyleSchema,
  NodeTypeSchema,
  PointSchema,
} from '@/schemas/nodeSchema';

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

export const ElementTypeSchema = z.union([
  z.literal('arrow'),
  z.literal('rectangle'),
  z.literal('ellipse'),
  z.literal('draw'),
  z.literal('text'),
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
export type NodeProps = z.infer<typeof NodePropsSchema>;
export type NodeStyle = z.infer<typeof NodeStyleSchema>;

export type NodeLIne = NodeStyle['line'];
export type NodeSize = NodeStyle['size'];
export type NodeColor = NodeStyle['color'];

export type Point = z.infer<typeof PointSchema>;

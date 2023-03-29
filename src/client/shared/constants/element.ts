import { z } from 'zod';
import ArrowDrawable from '@/client/components/shapes/ArrowDrawable/ArrowDrawable';
import EditableText from '@/client/components/shapes/EditableText/EditableText';
import EllipseDrawable from '@/client/components/shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/client/components/shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/client/components/shapes/RectDrawable/RectDrawable';
import { NodeConfig } from 'konva/lib/Node';
import { ShapeConfig } from 'konva/lib/Shape';
import { COLOR, LINE, SIZE } from './style';
import { Writeable } from '@/client/types';
import { createUnionSchema } from '../lib/zod';

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

export const PointSchema = z.number().array().length(2);

export const NodePropsSchema = z.object({
  id: z.string(),
  point: PointSchema,
  points: PointSchema.array().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  rotation: z.number(),
  visible: z.boolean(),
  bend: z.number().optional(),
});

export const NodeStyleSchema = z.object({
  color: createUnionSchema(COLOR.map((color) => color.value)),
  line: z.number().array().length(2),
  size: createUnionSchema(SIZE.map((size) => size.value)),
  animated: z.boolean().optional(),
  opacity: z.number().optional(),
});

export const NodeTypeSchema = z.object({
  type: ElementTypeSchema,
  nodeProps: NodePropsSchema,
  text: z.string().nullable(),
  style: NodeStyleSchema,
});

export type NodeType = z.infer<typeof NodeTypeSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
export type NodeProps = z.infer<typeof NodePropsSchema>;
export type NodeStyle = z.infer<typeof NodeStyleSchema>;

export type NodeLIne = Writeable<(typeof LINE)[number]['value']>;
export type NodeSize = (typeof SIZE)[number]['value'];
export type NodeColor = (typeof COLOR)[number]['value'];

export type Point = z.infer<typeof PointSchema>;

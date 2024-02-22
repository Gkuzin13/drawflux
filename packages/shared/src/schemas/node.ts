import { z } from 'zod';
import { colors } from '../design/theme';
import { createUnionSchema } from '../utils/zod';

const Type = z.union([
  z.literal('arrow'),
  z.literal('rectangle'),
  z.literal('ellipse'),
  z.literal('draw'),
  z.literal('text'),
  z.literal('laser'),
]);

const Size = z.union([
  z.literal('small'),
  z.literal('medium'),
  z.literal('large'),
  z.literal('extra-large'),
]);

const Line = z.union([
  z.literal('solid'),
  z.literal('dashed'),
  z.literal('dotted'),
]);

const Fill = z.union([
  z.literal('none'),
  z.literal('semi'),
  z.literal('solid'),
]);

const ArrowHead = z.union([z.literal('none'), z.literal('arrow')]);

export const NodePoint = z.tuple([z.number(), z.number()]) as z.ZodTuple<
  [x: z.ZodNumber, y: z.ZodNumber]
>;

const NodeProps = z.object({
  id: z.string().uuid(),
  point: NodePoint,
  points: NodePoint.array().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  rotation: z.number(),
  visible: z.boolean(),
  bend: z.number().optional(),
});

const Style = z.object({
  color: createUnionSchema(Object.keys(colors) as (keyof typeof colors)[]),
  fill: Fill.optional(),
  line: Line,
  size: Size,
  animated: z.boolean().optional(),
  opacity: z.number().min(0.2).max(1),
  arrowStartHead: ArrowHead.optional(),
  arrowEndHead: ArrowHead.optional(),
});

export const Node = z.object({
  type: Type,
  nodeProps: NodeProps,
  text: z.string().nullable(),
  style: Style,
});

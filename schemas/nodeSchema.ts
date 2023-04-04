import { z } from 'zod';
import { createUnionSchema } from '@/lib/zod';
import { ElementTypeSchema } from '@/client/shared/constants/element';
import { COLOR, SIZE } from '@/client/shared/constants/style';

export const PointSchema = z.tuple([z.number(), z.number()]);

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
  line: z.tuple([z.number(), z.number()]),
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

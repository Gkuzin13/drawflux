import { z } from 'zod';
import { colors } from '../design/design';
import { createUnionSchema } from './zod';
const Type = z.union([
    z.literal('arrow'),
    z.literal('rectangle'),
    z.literal('ellipse'),
    z.literal('draw'),
    z.literal('text'),
]);
const SizeStyle = z.union([
    z.literal(2),
    z.literal(4),
    z.literal(6),
    z.literal(8),
]);
const NodePoint = z.tuple([z.number(), z.number()]);
const NodeProps = z.object({
    id: z.string(),
    point: NodePoint,
    points: NodePoint.array().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    rotation: z.number(),
    visible: z.boolean(),
    bend: z.number().optional(),
});
const Style = z.object({
    color: createUnionSchema(Object.values(colors)),
    line: z.tuple([z.number(), z.number()]),
    size: SizeStyle,
    animated: z.boolean().optional(),
    opacity: z.number().optional(),
});
export const Node = z.object({
    type: Type,
    nodeProps: NodeProps,
    text: z.string().nullable(),
    style: Style,
});

import { z } from 'zod';
import { colors } from '../design/design';
import { createUnionSchema } from '../utils/zod';
import { NodePoint, Node } from './node';

export const UserId = z.string().uuid();

export const User = z.object({
  id: UserId,
  name: z.string(),
  color: createUnionSchema(Object.keys(colors) as (keyof typeof colors)[]),
  position: NodePoint,
});

export const Room = z.object({
  id: z.string().uuid(),
  users: User.array(),
  nodes: Node.array(),
});

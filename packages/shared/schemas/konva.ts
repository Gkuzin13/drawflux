import { z } from 'zod';

export const Vector2d = z.object({
  x: z.number(),
  y: z.number(),
});

export const StageConfig = z.object({
  scale: z.number(),
  position: Vector2d,
});

import { z } from 'zod';
import { Node } from './node';

export const Vector2d = z.object({
  x: z.number(),
  y: z.number(),
});

export const StageConfig = z.object({
  scale: z.number(),
  position: Vector2d,
});

export const Page = z.object({
  page: z.object({
    stageConfig: StageConfig,
    nodes: Node.array(),
  }),
});

export const SharePageRequestBody = Page;
export const GetPageResponse = z.object({
  page: z.object({
    id: z.string().uuid(),
    stageConfig: StageConfig,
    nodes: Node.array(),
  }),
});
export const SharePageResponse = z.object({
  id: z.string().uuid(),
});
export const UpdatePageResponse = z.object({
  id: z.string().uuid(),
});
export const UpdatePageBody = z.object({
  nodes: Node.array(),
});

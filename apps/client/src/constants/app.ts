import { Schemas } from 'shared';
import { z } from 'zod';
import { ToolType } from './tool';

export const LOCAL_STORAGE = {
  KEY: 'drawflux',
};

export const PageState = z.object({
  page: z.object({
    stageConfig: Schemas.StageConfig,
    nodes: Schemas.Node.array(),
    control: z.object({
      toolType: ToolType,
      selectedNodeId: z.string().or(z.null()),
    }),
  }),
});

const { control } = PageState.shape.page.shape;

export type PageStateType = z.infer<typeof PageState>;
export type ControlState = z.infer<typeof control>;

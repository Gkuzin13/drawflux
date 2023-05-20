import { Schemas } from 'shared';
import { z } from 'zod';
import { ToolType } from './tool';

export const BASE_URL = 'https://drawflux-api.onrender.com';
export const PAGE_URL_SEARCH_PARAM_KEY = 'page';

export const LOCAL_STORAGE = {
  KEY: 'drawflux',
} as const;

export const PageState = z.object({
  page: z.object({
    stageConfig: Schemas.StageConfig,
    nodes: Schemas.Node.array(),
    toolType: ToolType,
    selectedNodesIds: z.record(z.string(), z.boolean()),
  }),
});

export type PageStateType = z.infer<typeof PageState>;
export type SelectedNodesIds = z.infer<
  (typeof PageState)['shape']['page']['shape']['selectedNodesIds']
>;

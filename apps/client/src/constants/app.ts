import { Schemas } from 'shared';
import { z } from 'zod';
import { ToolType } from './tool';

export const BASE_URL = 'https://drawflux-api.onrender.com';
export const BASE_URL_DEV = 'http://localhost:7456';

export const BASE_WS_URL = 'wss://drawflux-api.onrender.com';
export const BASE_WS_URL_DEV = 'ws://localhost:7456';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const PAGE_URL_SEARCH_PARAM_KEY = 'page';
export const LOCAL_STORAGE_KEY = 'drawflux';

export const USER = {
  maxNameLength: 10,
};

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

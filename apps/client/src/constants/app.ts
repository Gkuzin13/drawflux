import { Schemas } from 'shared';
import { z } from 'zod';

export const BASE_URL = 'https://drawflux-api.onrender.com';
export const BASE_URL_DEV = 'http://localhost:7456';

export const BASE_WS_URL = 'wss://drawflux-api.onrender.com';
export const BASE_WS_URL_DEV = 'ws://localhost:7456';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const PAGE_URL_SEARCH_PARAM_KEY = 'page';
export const LOCAL_STORAGE_KEY = 'drawflux';

export const WS_THROTTLE_MS = 16;

export const PROJECT_FILE_EXT = 'drawflux';
export const PROJECT_FILE_NAME = 'project';

export const USER = {
  maxNameLength: 10,
};

export const ZOOM_RANGE = {
  MIN: 0.1,
  MAX: 2.5,
};
export const ZOOM_MULTIPLIER_VALUE = 0.1;
export const DEFAULT_ZOOM_VALUE = 1;

export const appState = z.object({
  page: z.object({
    ...Schemas.Page.shape.page.shape,
    toolType: z.union([
      ...Schemas.Node.shape.type.options,
      z.literal('hand'),
      z.literal('select'),
    ]),
    selectedNodesIds: z.record(z.string(), z.boolean()),
  }),
});

export type AppState = z.infer<typeof appState>;

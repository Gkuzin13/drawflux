import { getQuery } from '../../utils/string';
import type { NodeObject, StageConfig } from '@shared';

export type GetPageArgs = [string];
export type SharePageArgs = [string, string];

export type PageRowObject = {
  stage_config: StageConfig;
  nodes: NodeObject[];
};

export default {
  getPage: getQuery('get-page'),
  sharePage: getQuery('share-page'),
  createPageTable: getQuery('create-page-table'),
};

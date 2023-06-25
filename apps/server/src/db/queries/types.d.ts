import type { NodeObject, StageConfig } from 'shared';

export type GetPageValues = [PageId: string];
export type SharePageValues = [StageConfig: string, Nodes: string];
export type UpdatePageValues = [PageId: string, Nodes: string];

export type GetPageReturn = {
  id: string;
  stageConfig: StageConfig;
  nodes: NodeObject[];
};

export type SharePageReturn = {
  id: string;
};

export type UpdatePageReturn = {
  id: string;
};

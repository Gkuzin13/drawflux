import type { NodeObject, StageConfig } from '@shared';

export type GetPageArgs = [string];
export type SharePageArgs = [string, string];

export type PageRowObject = {
  stageConfig: StageConfig;
  nodes: NodeObject[];
};

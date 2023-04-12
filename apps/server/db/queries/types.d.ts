import type { NodeObject, StageConfig } from '@shared';

export type GetPageArgs = [string];
export type SharePageArgs = [string, string];

export type PageRowObject = {
  stage_config: StageConfig;
  nodes: NodeObject[];
  created_at: string;
};

import { StageConfig } from './konva';
import { NodeObject } from './node';

export type SharePageParams = {
  page: {
    stageConfig: StageConfig;
    nodes: NodeObject[];
  };
};

export type GetPageParams = {
  id: string;
};

import { type StageConfig } from './konva';
import { type NodeObject } from './node';

export type SharePageParams = {
  page: {
    stageConfig: StageConfig;
    nodes: NodeObject[];
  };
};

export type GetPageParams = {
  id: string;
};

export type PostQRCodeBody = {
  url: string;
};

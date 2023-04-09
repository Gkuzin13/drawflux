import { BadRequestError } from '../utils/errors';
import { StageConfig } from './konva';
import { NodeObject } from './node';

export type ServerResponse<T> = {
  error?: typeof BadRequestError;
  data?: T;
};

export type SharedPage = {
  page: {
    id: string;
    stageConfig: StageConfig;
    nodes: NodeObject[];
  };
};

export type SharePageResponse = {
  id: string;
};

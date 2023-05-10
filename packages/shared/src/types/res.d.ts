import { type BadRequestError } from '../utils/errors';
import { type StageConfig } from './konva';
import { type NodeObject } from './node';

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

export type GetQRCodeResponse = {
  dataUrl: string;
};

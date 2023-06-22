import type { z } from 'zod';
import { Node } from '../schemas/node';
import type {
  GetPageResponse,
  SharePageRequestBody,
  SharePageResponse,
  StageConfig,
} from '../schemas/page';
import type { QRCodeRequestBody, QRCodeResponse } from '../schemas/qrcode';
import type { Room, User } from '../schemas/share';
import type { MessageSchemas } from '../schemas/ws';
import type { BadRequestError } from '../utils/errors';

const { nodeProps, style, type } = Node.shape;

export type NodeObject = z.infer<typeof Node>;
export type NodeProps = z.infer<typeof nodeProps>;
export type NodeStyle = z.infer<typeof style>;
export type NodeType = z.infer<typeof type>;

export type NodeLine = NodeStyle['line'];
export type NodeSize = NodeStyle['size'];
export type NodeColor = NodeStyle['color'];

export type Point = z.infer<(typeof nodeProps)['shape']['point']>;

export type StageConfig = z.infer<typeof StageConfig>;

export type SharePageRequestBody = z.infer<typeof SharePageRequestBody>;
export type GetPageResponse = z.infer<typeof GetPageResponse>;
export type SharePageResponse = z.infer<typeof SharePageResponse>;

export type QRCodeRequestBody = z.infer<typeof QRCodeRequestBody>;
export type QRCodeResponse = z.infer<typeof QRCodeResponse>;

export type ServerResponse<T> = {
  error?: typeof BadRequestError;
  data?: T;
};

export type WSMessage<
  K extends keyof typeof MessageSchemas = keyof typeof MessageSchemas,
> = z.infer<(typeof MessageSchemas)[K]>;

export type CollabRoom = z.infer<typeof Room>;
export type CollabUser = z.infer<typeof User>;

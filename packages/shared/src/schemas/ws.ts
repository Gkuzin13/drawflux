import { z } from 'zod';
import { createUnionSchema } from '../utils/zod';
import { Node, NodePoint } from './node';
import { Room, User, UserId } from './share';

export type MessageType =
  | 'room-joined'
  | 'user-joined'
  | 'user-left'
  | 'user-change'
  | 'nodes-add'
  | 'nodes-update'
  | 'nodes-delete'
  | 'node-draft-add'
  | 'node-draft-draw'
  | 'node-draft-update';

function makeMessageSchema<T extends z.ZodRawShape>(
  types: MessageType[],
  schema: T,
) {
  return z.object({
    type: createUnionSchema(types),
    data: z.object(schema),
  });
}

export const MessageSchemas = {
  roomJoined: makeMessageSchema(['room-joined'], {
    userId: UserId,
    room: Room,
  }),
  userJoined: makeMessageSchema(['user-joined'], {
    user: User,
  }),
  userLeft: makeMessageSchema(['user-left'], {
    userId: UserId,
  }),
  userChange: makeMessageSchema(['user-change'], {
    user: User.partial({ position: true, color: true, name: true }),
  }),
  nodesAddUpdate: makeMessageSchema(['nodes-add', 'nodes-update'], {
    nodes: Node.array(),
  }),
  nodesDelete: makeMessageSchema(['nodes-delete'], {
    nodesIds: z.string().array(),
  }),
  draftNodeAdd: makeMessageSchema(['node-draft-add'], {
    node: Node,
  }),
  draftNodeDraw: makeMessageSchema(['node-draft-draw'], {
    id: Node.shape.nodeProps.shape.id,
    type: Node.shape.type,
    startPosition: NodePoint,
    currentPosition: NodePoint,
  }),
  draftTextNodeUpdate: makeMessageSchema(['node-draft-update'], {
    id: Node.shape.nodeProps.shape.id,
    text: Node.shape.text,
  }),
};

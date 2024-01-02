import type { colors } from '../design/theme';
import type { NodeObject, Point } from '.';

export type User = {
  id: string;
  name: string;
  color: keyof typeof colors;
};

export type Room = {
  id: string;
  users: User[];
};

type Message<T extends string, D extends object> = {
  type: T;
  data: D;
};

type RoomJoined = Message<
  'room-joined',
  { thisUser: User; collaborators: User[] }
>;
type UserJoined = Message<'user-joined', User>;
type UserLeft = Message<'user-left', { id: string }>;
type UserChange = Message<'user-change', User>;
type UserMove = Message<'user-move', { id: string; position: Point }>;
type NodesAdd = Message<'nodes-add', NodeObject[]>;
type NodesUpdate = Message<'nodes-update', NodeObject[]>;
type NodesSet = Message<'nodes-set', NodeObject[]>;
type NodesDelete = Message<'nodes-delete', string[]>;
type NodesMoveToStart = Message<'nodes-move-to-start', string[]>;
type NodesMoveToEnd = Message<'nodes-move-to-end', string[]>;
type NodesMoveForward = Message<'nodes-move-forward', string[]>;
type NodesMoveBackward = Message<'nodes-move-backward', string[]>;
type DraftCreate = Message<'draft-create', { node: NodeObject }>;
type DraftDraw = Message<
  'draft-draw',
  {
    userId: string;
    nodeId: string;
    position: { start: Point; current: Point };
  }
>;
type DraftUpdate = Message<
  'draft-update',
  { userId: string; node: NodeObject }
>;
type DraftFinish = Message<
  'draft-finish',
  { userId: string; node: NodeObject; keep?: boolean }
>;

export type WSMessage =
  | RoomJoined
  | UserJoined
  | UserLeft
  | UserChange
  | UserMove
  | NodesAdd
  | NodesUpdate
  | NodesSet
  | NodesDelete
  | NodesMoveToStart
  | NodesMoveToEnd
  | NodesMoveForward
  | NodesMoveBackward
  | DraftCreate
  | DraftDraw
  | DraftUpdate
  | DraftFinish;

import type { colors } from '../design/theme';
import type { NodeObject, NodeType, Point } from '.';

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
  { userId: string; users: User[]; nodes: NodeObject[] }
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
type DraftNodeAdd = Message<'draft-add', NodeObject>;
type DraftNodeDraw = Message<
  'draft-draw',
  {
    nodeId: string;
    userId: string;
    type: Omit<NodeType, 'text'>;
    position: { start: Point; current: Point };
  }
>;
type DraftNodeEnd = Message<'draft-end', NodeObject>;
type DraftTextNodeUpdate = Message<
  'draft-text-update',
  { id: string; text: string }
>;
type HistoryChange = Message<'history-change', { action: 'undo' | 'redo' }>;

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
  | DraftNodeAdd
  | DraftNodeDraw
  | DraftNodeEnd
  | DraftTextNodeUpdate
  | HistoryChange;

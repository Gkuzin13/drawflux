import type { colors } from '../design/design';
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
type UserJoined = Message<'user-joined', { user: User }>;
type UserLeft = Message<'user-left', { id: string }>;
type UserChange = Message<'user-change', { user: User }>;
type UserMove = Message<'user-move', { id: string; position: Point }>;
type NodesAdd = Message<'nodes-add', { nodes: NodeObject[] }>;
type NodesUpdate = Message<'nodes-update', { nodes: NodeObject[] }>;
type NodesSet = Message<'nodes-set', { nodes: NodeObject[] }>;
type NodesDelete = Message<'nodes-delete', { nodesIds: string[] }>;
type NodesDuplicate = Message<'nodes-duplicate', { nodesIds: string[] }>;
type NodesMoveToStart = Message<'nodes-move-to-start', { nodesIds: string[] }>;
type NodesMoveToEnd = Message<'nodes-move-to-end', { nodesIds: string[] }>;
type NodesMoveForward = Message<'nodes-move-forward', { nodesIds: string[] }>;
type NodesMoveBackward = Message<'nodes-move-backward', { nodesIds: string[] }>;
type DraftNodeAdd = Message<'draft-add', { node: NodeObject }>;
type DraftNodeDraw = Message<
  'draft-draw',
  {
    nodeId: string;
    userId: string;
    type: Omit<NodeType, 'text'>;
    position: { start: Point; current: Point };
  }
>;
type DraftNodeEnd = Message<'draft-end', { id: string }>;
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
  | NodesDuplicate
  | NodesMoveToStart
  | NodesMoveToEnd
  | NodesMoveForward
  | NodesMoveBackward
  | DraftNodeAdd
  | DraftNodeDraw
  | DraftNodeEnd
  | DraftTextNodeUpdate
  | HistoryChange;

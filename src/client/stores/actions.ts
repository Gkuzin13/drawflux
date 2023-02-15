export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export const ACTION_TYPES = Object.freeze({
  ADD_NODE: 'ADD_NODE',
  UPDATE_NODE: 'UPDATE_NODE',
  DELETE_NODE: 'DELETE_NODE',
  DELETE_ALL_NODES: 'DELETE_ALL_NODES',
  UNDO: 'UNDO',
  REDO: 'REDO',
});

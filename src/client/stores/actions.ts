export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export const ACTION_TYPES = Object.freeze({
  UNDO: 'UNDO',
  REDO: 'REDO',
});

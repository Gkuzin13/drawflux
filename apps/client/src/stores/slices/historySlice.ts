import { Action, createAction, Reducer } from '@reduxjs/toolkit';
import { NodesState } from './nodesSlice';
import type { NodeObject } from '@shared';

export type HistoryState = {
  past: NodeObject[];
  present: NodesState;
  future: NodeObject[];
};

export type HistoryActionType =
  (typeof historyActions)[keyof typeof historyActions]['type'];

export const historyActions = {
  undo: createAction('history/undo'),
  redo: createAction('history/redo'),
};

function undoable(
  reducer: Reducer<NodesState, Action<HistoryActionType | undefined>>,
) {
  const initialState: HistoryState = {
    past: [],
    present: reducer({ nodes: [] }, { type: undefined }),
    future: [],
  };

  return function (state = initialState, action: Action<HistoryActionType>) {
    const { past, present, future } = state;

    switch (action.type) {
      case 'history/undo':
        const previous = past[past.length - 1];

        if (!previous) return state;

        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case 'history/redo':
        const next = future[0];

        if (!next) return state;

        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      default:
        const newPresent = reducer(present, action);

        if (present === newPresent) {
          return state;
        }

        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  };
}

export default undoable;

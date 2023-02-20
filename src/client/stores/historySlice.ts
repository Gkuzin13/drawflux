import { NodeType } from '@/client/shared/element';
import { Action, Reducer } from '@reduxjs/toolkit';
import { ActionType, ACTION_TYPES } from './actions';

export type HistoryState<T> = {
  past: NodeType[];
  present: T;
  future: NodeType[];
};

function undoable<T>(reducer: Reducer<T, Action<ActionType | undefined>>) {
  const initialState = {
    past: [] as NodeType[],
    present: reducer(undefined, { type: undefined }),
    future: [] as NodeType[],
  };

  return function (state = initialState, action: { type: ActionType }) {
    const { past, present, future } = state;

    switch (action.type) {
      case ACTION_TYPES.UNDO:
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case ACTION_TYPES.REDO:
        const next = future[0];
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

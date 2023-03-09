import { NodeType } from '@/client/shared/constants/element';
import { Action, createAction, Reducer } from '@reduxjs/toolkit';
import { ActionType } from '../actions';
import { NodesState } from './nodesSlice';

export type HistoryState = {
  past: NodeType[];
  present: NodesState;
  future: NodeType[];
};

export type HistoryActionType =
  (typeof historyActions)[keyof typeof historyActions]['type'];

export const historyActions = {
  undo: createAction('undo'),
  redo: createAction('redo'),
};

function undoable(
  reducer: Reducer<NodesState, Action<ActionType | undefined>>,
) {
  const initialState: HistoryState = {
    past: [],
    present: reducer({ nodes: [] }, { type: undefined }),
    future: [],
  };

  return function (state = initialState, action: Action<HistoryActionType>) {
    const { past, present, future } = state;

    switch (action.type) {
      case 'undo':
        const previous = past[past.length - 1];

        if (!previous) return state;

        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case 'redo':
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

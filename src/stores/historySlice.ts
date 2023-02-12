import { Node } from '@/shared/constants/base';
import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { ACTION_TYPES } from './actions';

const { UNDO, REDO } = ACTION_TYPES;

export type HistoryState = {
  past: Node[];
  present: Node;
  future: Node[];
};

interface HistoryReducerReturn extends Omit<HistoryState, 'present'> {
  present: { nodes: Node[] };
}

function undoable(reducer: Reducer) {
  const initialState: HistoryState = {
    past: [],
    present: reducer(undefined, { type: '' }),
    future: [],
  };

  return function (state = initialState, action: AnyAction): HistoryState {
    const { past, present, future } = state;

    switch (action.type) {
      case UNDO:
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case REDO:
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

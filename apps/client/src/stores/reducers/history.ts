import { type Action, createAction, type Reducer } from '@reduxjs/toolkit';
import { initialState as initialCanvasState } from '../slices/canvas';
import type { CanvasActionType, CanvasSliceState } from '../slices/canvas';

export type CanvasHistoryState = {
  past: CanvasSliceState[];
  present: CanvasSliceState;
  future: CanvasSliceState[];
};

export type HistoryActionType =
  (typeof historyActions)[keyof typeof historyActions]['type'];

export type HistoryActionKey = keyof typeof historyActions;

export const historyActions = {
  undo: createAction('history/undo'),
  redo: createAction('history/redo'),
  reset: createAction('history/reset'),
};

export type IgnoreActionType = HistoryActionType | CanvasActionType;

const IGNORED_ACTIONS: IgnoreActionType[] = [
  'canvas/setToolType',
  'canvas/setStageConfig',
  'canvas/set',
  'canvas/setSelectedNodesIds',
];

function isIgnoredActionType(type: string) {
  return IGNORED_ACTIONS.includes(type as IgnoreActionType);
}

function undoable(
  reducer: Reducer<
    CanvasSliceState,
    Action<HistoryActionType | CanvasActionType | undefined>
  >,
) {
  const initialState: CanvasHistoryState = {
    past: [],
    present: reducer(initialCanvasState, { type: undefined }),
    future: [],
  };

  return function (
    state = initialState,
    action: Action<HistoryActionType | CanvasActionType>,
  ) {
    const { past, present, future } = state;

    if (isIgnoredActionType(action.type)) {
      return {
        ...state,
        present: reducer(present, action),
      };
    }

    switch (action.type) {
      case 'history/undo': {
        const previous = past[past.length - 1];

        if (!previous) return state;

        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      }
      case 'history/redo': {
        const next = future[0];

        if (!next) return state;

        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      }
      case 'history/reset': {
        return { past: [], present, future: [] };
      }
      default: {
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
    }
  };
}

export default undoable;

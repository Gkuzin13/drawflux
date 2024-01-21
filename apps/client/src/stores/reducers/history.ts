import { createAction, isAnyOf } from '@reduxjs/toolkit';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';

export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export type HistoryAction = (typeof historyActions)[HistoryActionKey];
export type HistoryActionType = HistoryAction['type'];
export type HistoryActionKey = keyof typeof historyActions;

export const historyActions = {
  undo: createAction('history/undo'),
  redo: createAction('history/redo'),
  reset: createAction('history/reset'),
};

function historyReducer<R extends Reducer, S extends ReturnType<R>>(
  reducer: R,
  initialState: S,
  ignoredActions?: readonly AnyAction[],
): Reducer<HistoryState<S>> {
  const initialHistoryState: HistoryState<S> = {
    past: [],
    present: reducer(initialState, { type: undefined }),
    future: [],
  };

  const ignoredActionMatchers = ignoredActions?.map((action) => action.match);
  const isAnyOfIgnoredActions = isAnyOf(...(ignoredActionMatchers ?? []));

  return function (state = initialHistoryState, action) {
    const { past, present, future } = state;

    if (ignoredActions && isAnyOfIgnoredActions(action as AnyAction)) {
      return { past, present: reducer(present, action), future };
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

export default historyReducer;

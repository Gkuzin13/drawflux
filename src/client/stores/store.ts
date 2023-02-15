import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import nodesReducer, { NodesState } from './nodesSlice';
import historyReducer, { HistoryState } from './historySlice';
import { ActionType } from './actions';

const undoableNodes = historyReducer<NodesState>(nodesReducer);

export const store = configureStore({
  reducer: undoableNodes as Reducer<
    HistoryState<NodesState>,
    Action<ActionType>
  >,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import { ActionType } from './actions';
import nodesReducer, { NodesState } from './slices/nodesSlice';
import historyReducer, { HistoryState } from './slices/historySlice';
import stageConfig from './slices/stageConfigSlice';
import control from './slices/controlSlice';

const undoableNodes = historyReducer<NodesState>(nodesReducer) as Reducer<
  HistoryState<NodesState>,
  Action<ActionType>
>;

export const store = configureStore({
  reducer: { undoableNodes, control, stageConfig },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import nodesReducer from './slices/nodesSlice';
import historyReducer, {
  HistoryActionType,
  HistoryState,
} from './slices/historySlice';
import stageConfig from './slices/stageConfigSlice';
import control from './slices/controlSlice';
import modal from './slices/modalSlice';

const undoableNodes = historyReducer(nodesReducer) as Reducer<
  HistoryState,
  Action<HistoryActionType>
>;

export const store = configureStore({
  reducer: { undoableNodes, control, stageConfig, modal },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

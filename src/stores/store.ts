import { combineReducers, configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import historyReducer from './historySlice';

const undoableNodes = historyReducer(nodesReducer);

export const store = configureStore({
  reducer: undoableNodes,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

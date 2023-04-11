import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import nodesReducer from './slices/nodesSlice';
import historyReducer, {
  HistoryActionType,
  NodesHistoryState,
} from './slices/historySlice';
import stageConfig from './slices/stageConfigSlice';
import control from './slices/controlSlice';
import modal from './slices/modalSlice';
import { api } from '@/services/api';
import { listenerMiddleware } from './listenerMiddleware';

const nodesHistory = historyReducer(nodesReducer) as Reducer<
  NodesHistoryState,
  Action<HistoryActionType>
>;

export const store = configureStore({
  reducer: {
    nodesHistory,
    control,
    stageConfig,
    modal,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

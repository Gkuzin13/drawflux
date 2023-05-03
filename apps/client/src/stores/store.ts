import { type Action, configureStore, type Reducer } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { listenerMiddleware } from './listenerMiddleware';
import canvas from './slices/canvasSlice';
import contextMenu from './slices/contextMenu';
import historyReducer, {
  type HistoryActionType,
  type NodesHistoryState,
} from './slices/historySlice';
import modal from './slices/modalSlice';
import nodesReducer from './slices/nodesSlice';

const nodesHistory = historyReducer(nodesReducer) as Reducer<
  NodesHistoryState,
  Action<HistoryActionType>
>;

export const store = configureStore({
  reducer: {
    nodesHistory,
    canvas,
    modal,
    contextMenu,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

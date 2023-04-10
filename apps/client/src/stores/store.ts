import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import nodesReducer from './slices/nodesSlice';
import historyReducer, {
  HistoryActionType,
  NodesHistoryState,
  nodesHistoryInitialState,
} from './slices/historySlice';
import stageConfig, {
  stageConfigInitialState,
  StageConfigState,
} from './slices/stageConfigSlice';
import control, {
  controlInitialState,
  ControlState,
} from './slices/controlSlice';
import modal from './slices/modalSlice';
import { api } from '@/services/api';
import { listenerMiddleware } from './listenerMiddleware';
import { getFromStorage } from '@/utils/storage';
import { LOCAL_STORAGE } from '@/constants/app';

const nodesHistory = historyReducer(nodesReducer) as Reducer<
  NodesHistoryState,
  Action<HistoryActionType>
>;

type LocalStorageState = {
  page: {
    control: ControlState;
    nodesHistory: NodesHistoryState;
    stageConfig: StageConfigState;
  };
};

const defaultState = {
  nodesHistory: nodesHistoryInitialState,
  stageConfig: stageConfigInitialState,
  control: controlInitialState,
};

const stateFromStorage = getFromStorage<LocalStorageState>(LOCAL_STORAGE.KEY);

const preloadedState = { ...defaultState, ...stateFromStorage?.page };

export const store = configureStore({
  reducer: {
    nodesHistory,
    control,
    stageConfig,
    modal,
    [api.reducerPath]: api.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

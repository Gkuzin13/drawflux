import {
  createListenerMiddleware,
  addListener,
  isAnyOf,
  TypedStopListening,
} from '@reduxjs/toolkit';
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import { controlActions } from './slices/controlSlice';
import { historyActions } from './slices/historySlice';
import { stageConfigActions } from './slices/stageConfigSlice';
import { setToStorage } from '@/utils/storage';
import { LOCAL_STORAGE, PageStateType } from '@/constants/app';
import { api } from '@/services/api';
import { nodesActions } from './slices/nodesSlice';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppStopListening = TypedStopListening<RootState, AppDispatch>;

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const stopAppListening =
  listenerMiddleware.stopListening as AppStopListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

const actionsToListenTo = [
  controlActions.setSelectedNode,
  controlActions.setToolType,
  historyActions.undo,
  historyActions.redo,
  stageConfigActions.set,
  nodesActions.deleteAll,
  api.endpoints.getPage.matchFulfilled,
];

startAppListening({
  matcher: isAnyOf(...actionsToListenTo),
  effect: (action, listenerApi) => {
    if (api.endpoints.getPage.matchFulfilled(action)) {
      listenerApi.unsubscribe();
      return;
    }

    const { stageConfig, nodesHistory, control } = listenerApi.getState();

    setToStorage<PageStateType>(LOCAL_STORAGE.KEY, {
      page: { stageConfig, nodes: nodesHistory.present.nodes, control },
    });
  },
});

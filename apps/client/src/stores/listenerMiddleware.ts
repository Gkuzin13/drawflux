import {
  createListenerMiddleware,
  addListener,
  isAnyOf,
  type TypedStopListening,
  type TypedStartListening,
  type TypedAddListener,
} from '@reduxjs/toolkit';
import { LOCAL_STORAGE, type PageStateType } from '@/constants/app';
import { api } from '@/services/api';
import { setToStorage } from '@/utils/storage';
import { controlActions } from './slices/controlSlice';
import { historyActions } from './slices/historySlice';
import { nodesActions } from './slices/nodesSlice';
import { stageConfigActions } from './slices/stageConfigSlice';
import type { RootState, AppDispatch } from './store';

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
  controlActions.setSelectedNodeId,
  controlActions.setToolType,
  historyActions.undo,
  historyActions.redo,
  stageConfigActions.set,
  nodesActions.add,
  nodesActions.update,
  nodesActions.set,
  nodesActions.delete,
  nodesActions.deleteAll,
  api.endpoints.getPage.matchRejected,
  api.endpoints.getPage.matchFulfilled,
];

startAppListening({
  matcher: isAnyOf(...actionsToListenTo),
  effect: (action, listenerApi) => {
    if (
      api.endpoints.getPage.matchFulfilled(action) ||
      api.endpoints.getPage.matchRejected(action)
    ) {
      listenerApi.unsubscribe();
      return;
    }

    const { stageConfig, nodesHistory, control } = listenerApi.getState();

    setToStorage<PageStateType>(LOCAL_STORAGE.KEY, {
      page: { stageConfig, nodes: nodesHistory.present.nodes, control },
    });
  },
});

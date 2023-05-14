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
import { storage } from '@/utils/storage';
import { historyActions } from './reducers/history';
import { canvasActions } from './slices/canvas';
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
  historyActions.undo,
  historyActions.redo,
  canvasActions.addNodes,
  canvasActions.updateNodes,
  canvasActions.setNodes,
  canvasActions.deleteNodes,
  canvasActions.moveNodesToEnd,
  canvasActions.moveNodesBackward,
  canvasActions.moveNodesForward,
  canvasActions.moveNodesToStart,
  canvasActions.setSelectedNodesIds,
  canvasActions.setStageConfig,
  canvasActions.setToolType,
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

    const canvas = listenerApi.getState().canvas.present;

    storage.set<PageStateType>(LOCAL_STORAGE.KEY, {
      page: {
        ...canvas,
      },
    });
  },
});

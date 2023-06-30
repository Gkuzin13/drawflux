import {
  createListenerMiddleware,
  addListener,
  isAnyOf,
  type TypedStopListening,
  type TypedStartListening,
  type TypedAddListener,
} from '@reduxjs/toolkit';
import { type AppState, LOCAL_STORAGE_KEY } from '@/constants/app';
import { storage } from '@/utils/storage';
import { historyActions } from './reducers/history';
import { canvasActions } from './slices/canvas';
import { collaborationActions } from './slices/collaboration';
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
  collaborationActions.init,
];

startAppListening({
  matcher: isAnyOf(...actionsToListenTo),
  effect: (action, listenerApi) => {
    if (collaborationActions.init.match(action)) {
      listenerApi.unsubscribe();
      return;
    }
    const canvas = listenerApi.getState().canvas.present;
    storage.set<AppState>(LOCAL_STORAGE_KEY, { page: { ...canvas } });
  },
});

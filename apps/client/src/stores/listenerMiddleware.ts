import {
  createListenerMiddleware,
  addListener,
  isAnyOf,
} from '@reduxjs/toolkit';
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import { controlActions } from './slices/controlSlice';
import { historyActions } from './slices/historySlice';
import { stageConfigActions } from './slices/stageConfigSlice';
import { setToStorage } from '@/utils/storage';
import { LOCAL_STORAGE, PageStateType } from '@/constants/app';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

const { setSelectedNode, setToolType } = controlActions;
const { redo, undo } = historyActions;
const { set: setStageConfig } = stageConfigActions;

const actionsToListenTo = [
  setSelectedNode,
  setToolType,
  undo,
  redo,
  setStageConfig,
];

startAppListening({
  matcher: isAnyOf(...actionsToListenTo),
  effect: (action, listenerApi) => {
    const { stageConfig, nodesHistory, control } = listenerApi.getState();

    setToStorage<PageStateType>(LOCAL_STORAGE.KEY, {
      page: { stageConfig, nodes: nodesHistory.present.nodes, control },
    });
  },
});

import { isAnyOf } from '@reduxjs/toolkit';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions } from '@/services/canvas/slice';
import { storage } from '@/utils/storage';
import { LOCAL_STORAGE_KEY } from '@/constants/app';
import { collaborationActions } from '@/services/collaboration/slice';
import type { AppStartListening } from '@/stores/middlewares/listenerMiddleware';
import type { AppState } from '@/constants/app';

export const addCanvasListener = (startListening: AppStartListening) => {
  const unsubscribe = startListening({
    matcher: isAnyOf(
      historyActions.undo,
      historyActions.redo,
      canvasActions.setNodes,
      canvasActions.addNodes,
      canvasActions.updateNodes,
      canvasActions.deleteNodes,
      canvasActions.moveNodesToEnd,
      canvasActions.moveNodesBackward,
      canvasActions.moveNodesForward,
      canvasActions.moveNodesToStart,
      canvasActions.setSelectedNodeIds,
      canvasActions.setStageConfig,
      canvasActions.setToolType,
      canvasActions.selectAllNodes,
      canvasActions.unselectAllNodes,
      canvasActions.setCurrentNodeStyle,
    ),
    effect: (_, listenerApi) => {
      const canvasState = listenerApi.getState().canvas.present;

      storage.set<AppState>(LOCAL_STORAGE_KEY, { page: canvasState });
    },
  });

  startListening({
    matcher: collaborationActions.init.match,
    effect: (_, listenerApi) => {
      unsubscribe({ cancelActive: true });
      
      listenerApi.dispatch(historyActions.reset());
      listenerApi.unsubscribe();
    },
  });
};

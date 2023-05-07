import type Konva from 'konva';
import { type RefObject, useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'react-redux';
import { KEYS, type Key } from '@/constants/keys';
import { TOOLS } from '@/constants/tool';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import { historyActions } from '@/stores/slices/historySlice';
import { nodesActions } from '@/stores/slices/nodesSlice';
import type { RootState } from '@/stores/store';

function useKeydownListener(stageRef: RefObject<Konva.Stage>) {
  const { selectedNodesIds } = useAppSelector(selectCanvas);
  const { toolType } = useAppSelector(selectCanvas);

  const store = useStore<RootState>();

  const stageContainer = useMemo(() => {
    if (!stageRef.current) {
      return null;
    }

    const container = stageRef.current.container();
    container.tabIndex = 1;
    container.focus();

    return container;
  }, [stageRef.current]);

  const dispatch = useAppDispatch();

  const dispatchActionsOnCtrlCombo = useCallback(
    (event: KeyboardEvent) => {
      const shiftPressed = event.shiftKey;
      const key = event.key.toLowerCase();

      switch (key) {
        case KEYS.Z: {
          return dispatch(
            shiftPressed ? historyActions.redo() : historyActions.undo(),
          );
        }
        case KEYS.D: {
          event.preventDefault();
          const nodesToDuplicate = Object.keys(selectedNodesIds);

          dispatch(nodesActions.duplicate(nodesToDuplicate));

          const duplicatedNodes = store
            .getState()
            .nodesHistory.present.nodes.slice(-nodesToDuplicate.length)
            .map((node) => node.nodeProps.id);

          dispatch(canvasActions.setSelectedNodesIds(duplicatedNodes));
        }
      }
    },
    [selectedNodesIds],
  );

  useEffect(() => {
    if (!stageContainer) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key as Key;

      if (event.ctrlKey) {
        dispatchActionsOnCtrlCombo(event);
        return;
      }

      if (key === KEYS.DELETE) {
        dispatch(nodesActions.delete(Object.keys(selectedNodesIds)));
        return;
      }

      const toolTypeByKey = TOOLS.find(
        (tool) => tool.key === key.toLowerCase(),
      );

      dispatch(canvasActions.setToolType(toolTypeByKey?.value || 'select'));
    };

    stageContainer.addEventListener('keydown', handleKeyUp);

    return () => {
      stageContainer.removeEventListener('keydown', handleKeyUp);
    };
  }, [toolType, selectedNodesIds]);
}

export default useKeydownListener;

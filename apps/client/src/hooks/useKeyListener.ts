import type Konva from 'konva';
import { type RefObject, useCallback, useEffect } from 'react';
import { KEYS, type Key } from '@/constants/keys';
import { TOOLS } from '@/constants/tool';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { uiActions } from '@/stores/slices/ui';

function useKeydownListener(stageRef: RefObject<Konva.Stage>) {
  const { selectedNodesIds } = useAppSelector(selectCanvas);
  const { toolType } = useAppSelector(selectCanvas);

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

          dispatch(canvasActions.duplicateNodes(nodesToDuplicate));
        }
      }
    },
    [selectedNodesIds],
  );

  useEffect(() => {
    const stageContainer = stageRef.current?.container();

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
        dispatch(canvasActions.deleteNodes(Object.keys(selectedNodesIds)));
        dispatch(uiActions.closeContextMenu());
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

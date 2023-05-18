import { useCallback, useEffect } from 'react';
import { KEYS } from '@/constants/keys';
import { TOOLS } from '@/constants/tool';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';

function useKbdShortcuts(element: HTMLElement | null) {
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
    if (!element) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;

      if (event.ctrlKey) {
        dispatchActionsOnCtrlCombo(event);
        return;
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(Object.keys(selectedNodesIds)));
        return;
      }

      const toolTypeByKey = TOOLS.find(
        (tool) => tool.key === key.toLowerCase(),
      );

      dispatch(canvasActions.setToolType(toolTypeByKey?.value || 'select'));
    };

    element.addEventListener('keydown', handleKeyUp);

    return () => {
      element.removeEventListener('keydown', handleKeyUp);
    };
  }, [toolType, selectedNodesIds, element]);
}

export default useKbdShortcuts;

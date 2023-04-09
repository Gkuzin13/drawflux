import { KEYS, Key } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { controlActions, selectControl } from '@/stores/slices/controlSlice';
import { historyActions } from '@/stores/slices/historySlice';
import { nodesActions } from '@/stores/slices/nodesSlice';
import { useCallback, useEffect } from 'react';

function useKeydownListener() {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);

  const dispatch = useAppDispatch();

  const getToolTypeByKey = useCallback((key: Key) => {
    switch (key.toLowerCase()) {
      case KEYS.H:
        return 'hand';
      case KEYS.D:
        return 'draw';
      case KEYS.A:
        return 'arrow';
      case KEYS.R:
        return 'rectangle';
      case KEYS.O:
        return 'ellipse';
      case KEYS.T:
        return 'text';
      case KEYS.V:
        return 'select';
      default:
        return 'select';
    }
  }, []);

  const getActionWhenCtrlKeyPressed = useCallback((event: KeyboardEvent) => {
    const shiftPressed = event.shiftKey;
    const key = event.key.toLowerCase();

    switch (key) {
      case KEYS.Z:
        return shiftPressed ? historyActions.redo() : historyActions.undo();
      case KEYS.C:
        return nodesActions.deleteAll();
    }
  }, []);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key as Key;

      if (event.ctrlKey) {
        const action = getActionWhenCtrlKeyPressed(event);
        action && dispatch(action);
        return;
      }

      if (selectedNodeId && key === KEYS.DELETE) {
        dispatch(nodesActions.delete([selectedNodeId]));
        return;
      }

      dispatch(controlActions.setToolType(getToolTypeByKey(key)));
    };

    if (toolType === 'text') {
      window.removeEventListener('keydown', handleKeyUp);
    } else {
      window.addEventListener('keydown', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyUp);
    };
  }, [toolType, selectedNodeId]);
}

export default useKeydownListener;

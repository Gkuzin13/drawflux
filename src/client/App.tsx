import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { Key, KEYS } from './shared/constants/keys';
import DrawingCanvas from './components/Stage/DrawingCanvas';
import { controlActions, selectControl } from './stores/slices/controlSlice';
import {
  selectStageConfig,
  stageConfigActions,
} from './stores/slices/stageConfigSlice';
import Panels from './components/Panels/Panels';
import { nodesActions } from './stores/slices/nodesSlice';
import { historyActions } from './stores/slices/historySlice';

const App = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

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
      default:
        return { type: '' }; // Temporary workaround
    }
  }, []);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key as Key;

      if (event.ctrlKey) {
        dispatch(getActionWhenCtrlKeyPressed(event));
        return;
      }

      if (selectedNodeId && key === KEYS.DELETE) {
        dispatch(nodesActions.delete([selectedNodeId]));
        return;
      }

      dispatch(controlActions.setToolType(getToolTypeByKey(key)));

      if (event.key === KEYS.T) {
        window.removeEventListener('keydown', handleKeyUp);
      }
    };

    window.addEventListener('keydown', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyUp);
    };
  }, [toolType, selectedNodeId]);

  return (
    <>
      <Panels />
      <DrawingCanvas
        config={{
          width: window.innerWidth,
          height: window.innerHeight,
          scale: { x: stageConfig.scale, y: stageConfig.scale },
          x: stageConfig.position.x,
          y: stageConfig.position.y,
        }}
        containerStyle={{ backgroundColor: 'fafafa' }}
        onConfigChange={(config) => dispatch(stageConfigActions.set(config))}
      />
    </>
  );
};

export default App;

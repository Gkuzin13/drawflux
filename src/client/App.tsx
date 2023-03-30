import { useCallback, useEffect, useRef } from 'react';
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
import Konva from 'konva';
import Modal from './components/Modal/Modal';
import { modalActions, selectModal } from './stores/slices/modalSlice';

const App = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);
  const modal = useAppSelector(selectModal);

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);

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

  return (
    <>
      <Panels stageRef={stageRef} />
      <DrawingCanvas
        ref={stageRef}
        config={{
          width: window.innerWidth,
          height: window.innerHeight,
          scale: { x: stageConfig.scale, y: stageConfig.scale },
          x: stageConfig.position.x,
          y: stageConfig.position.y,
        }}
        onConfigChange={(config) => dispatch(stageConfigActions.set(config))}
      />
      {modal.open && (
        <Modal
          title={modal.title}
          message={modal.message}
          onClose={() => dispatch(modalActions.close())}
        />
      )}
    </>
  );
};

export default App;

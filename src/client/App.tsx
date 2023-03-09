import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { Key, KEYS } from './shared/constants/keys';
import DrawingCanvas from './components/Stage/DrawingCanvas';
import { controlActions, selectControl } from './stores/slices/controlSlice';
import {
  selectStageConfig,
  stageConfigActions,
} from './stores/slices/stageConfigSlice';
import { globalStyle } from './shared/styles/global';
import Panels from './components/Panels/Panels';

const App = () => {
  const { toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const dispatch = useAppDispatch();

  const getToolTypeByKey = useCallback((key: Key) => {
    switch (key) {
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

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      dispatch(controlActions.setToolType(getToolTypeByKey(event.key as Key)));
      if (event.key === KEYS.T) {
        window.removeEventListener('keyup', handleKeyUp);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toolType]);

  globalStyle();

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

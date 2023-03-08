import { useCallback, useEffect, useMemo } from 'react';
import { nodesActions, selectNodes } from './stores/slices/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { Key, KEYS } from './shared/keys';
import { NodeStyle } from './shared/element';
import StylesDock from './components/StylePanel/StylePanel';
import ToolsDock from './components/ToolsDock/ToolsDock';
import { Tool } from './shared/tool';
import ControlPanel from './components/ControlPanel/ControlPanel';
import DrawingCanvas from './components/Stage/DrawingCanvas';
import { controlActions, selectControl } from './stores/slices/controlSlice';
import {
  selectStageConfig,
  stageConfigActions,
} from './stores/slices/stageConfigSlice';
import ZoomPanel from './components/ZoomPanel/ZoomPanel';

const App = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.nodeProps.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

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

  const onNodeTypeChange = (type: Tool['value']) => {
    dispatch(controlActions.setToolType(type));
  };

  const handleStyleChange = (style: NodeStyle) => {
    if (!selectedNode) return;

    const updatedNode = { ...selectedNode, style };

    dispatch(nodesActions.update([updatedNode]));
  };

  return (
    <>
      <ToolsDock onToolSelect={onNodeTypeChange} />
      {selectedNode && (
        <StylesDock
          style={selectedNode.style}
          onStyleChange={handleStyleChange}
        />
      )}
      <ControlPanel
        onHistoryControl={(type) => dispatch({ type })}
        onNodesControl={dispatch}
        undoDisabled={!past.length}
        redoDisabled={!future.length}
      />
      <ZoomPanel
        value={stageConfig.scale}
        onZoomIncrease={() =>
          dispatch(stageConfigActions.changeScale('increase'))
        }
        onZoomDecrease={() =>
          dispatch(stageConfigActions.changeScale('decrease'))
        }
      />
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

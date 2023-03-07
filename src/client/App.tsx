import { useEffect, useMemo } from 'react';
import { nodesActions, selectNodes } from './stores/slices/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { KEYS } from './shared/keys';
import { NodeStyle } from './shared/element';
import StylesDock from './components/StylesDock/StylesDock';
import ToolsDock from './components/ToolsDock';
import { Tool } from './shared/tool';
import ControlDock from './components/ControlDock';
import DrawingCanvas from './components/Stage/DrawingCanvas';
import { controlActions, selectControl } from './stores/slices/controlSlice';
import {
  selectStageConfig,
  stageConfigActions,
} from './stores/slices/stageConfigSlice';

const defaultStyle: NodeStyle = {
  line: 'solid',
  color: 'black',
  size: 'medium',
};

const App = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  const selectedNode = nodes.find((n) => n.nodeProps.id === selectedNodeId);

  const stageScalePercent = useMemo(() => {
    return `${Math.round(stageConfig.scale * 100)}%`;
  }, [stageConfig.scale]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case KEYS.H:
          dispatch(controlActions.setToolType('hand'));
          break;
        case KEYS.V:
          dispatch(controlActions.setToolType('select'));
      }
    };

    if (toolType !== 'text') {
      window.addEventListener('keyup', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
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
      <div style={{ position: 'absolute', zIndex: 1 }}>
        <ToolsDock onToolSelect={onNodeTypeChange} />
        <StylesDock
          style={selectedNode?.style || defaultStyle}
          onStyleChange={handleStyleChange}
        />
        <ControlDock
          onHistoryControl={(type) => dispatch({ type })}
          onNodesControl={dispatch}
          undoDisabled={!past.length}
          redoDisabled={!future.length}
        />
        <div>
          <span>Zoom: {stageScalePercent}</span>
          <div>
            <button
              onClick={() =>
                dispatch(stageConfigActions.changeScale('increase'))
              }
            >
              +
            </button>
            <button
              onClick={() =>
                dispatch(stageConfigActions.changeScale('decrease'))
              }
            >
              -
            </button>
          </div>
        </div>
      </div>
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

import { useState, useEffect } from 'react';
import { selectNodes } from './stores/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { KEYS } from './shared/keys';
import { NodeStyle } from './shared/element';
import StylesDock from './components/StylesDock/StylesDock';
import ToolsDock from './components/ToolsDock';
import { Tool } from './shared/tool';
import ControlDock from './components/ControlDock';

import ShapesStage from './components/Stage';

const defaultStyle: NodeStyle = {
  line: 'solid',
  color: 'black',
  size: 'medium',
};

const App = () => {
  const [toolType, setToolType] = useState<Tool['value']>('arrow');
  const [stageScale, setStageScale] = useState(100);
  const [styleMenu, setStyleMenu] = useState<NodeStyle>(defaultStyle);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case KEYS.H:
          setToolType('hand');
          break;
        case KEYS.V:
          setToolType('select');
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
    setToolType(type);
  };

  const handleStageZoom = (scale: number) => {
    setStageScale(Math.round(scale * 100));
  };

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 1 }}>
        <ToolsDock onToolSelect={onNodeTypeChange} />
        <StylesDock
          style={styleMenu}
          onStyleChange={(updatedStyle) => setStyleMenu(updatedStyle)}
        />
        <ControlDock
          onHistoryControl={(type) => dispatch({ type })}
          onNodesControl={dispatch}
          undoDisabled={!past.length}
          redoDisabled={!future.length}
        />
        <div>
          <span>Zoom: {stageScale}%</span>
        </div>
      </div>

      <ShapesStage
        width={window.innerWidth}
        height={window.innerHeight}
        nodes={nodes}
        toolType={toolType}
        styleMenu={styleMenu}
        onStageZoomChange={handleStageZoom}
        onDraftEnd={() => setToolType('select')}
        onNodeSelect={(node) => setStyleMenu(node.style)}
      />
    </>
  );
};

export default App;

import ControlPanel from '../ControlPanel/ControlPanel';
import ToolsDock from '../ToolsPanel/ToolsPanel';
import ZoomPanel from '../ZoomPanel/ZoomPanel';
import StylePanel from '../StylePanel/StylePanel';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import {
  selectStageConfig,
  stageConfigActions,
} from '../../stores/slices/stageConfigSlice';
import { nodesActions, selectNodes } from '../../stores/slices/nodesSlice';
import {
  controlActions,
  selectControl,
} from '../../stores/slices/controlSlice';
import { Tool } from '../../shared/constants/tool';
import { useMemo } from 'react';
import { NodeStyle } from '../../shared/constants/element';

const Panels = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.nodeProps.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

  const dispatch = useAppDispatch();

  const onToolTypeChange = (type: Tool['value']) => {
    dispatch(controlActions.setToolType(type));
  };

  const handleStyleChange = (style: NodeStyle) => {
    if (!selectedNode) return;

    const updatedNode = { ...selectedNode, style };

    dispatch(nodesActions.update([updatedNode]));
  };

  return (
    <>
      <ToolsDock activeTool={toolType} onToolSelect={onToolTypeChange} />
      {selectedNode && (
        <StylePanel
          style={selectedNode.style}
          onStyleChange={handleStyleChange}
        />
      )}
      <ControlPanel
        onHistoryControl={(type) => dispatch({ type })}
        onNodesControl={dispatch}
        undoDisabled={!past.length}
        redoDisabled={!future.length}
        clearDisabled={!nodes.length}
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
    </>
  );
};

export default Panels;

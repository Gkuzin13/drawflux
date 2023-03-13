import { useMemo } from 'react';
import ControlPanel from './ControlPanel/ControlPanel';
import ToolsDock from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import StylePanel, { StylePanelProps } from './StylePanel/StylePanel';
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
import { NodeStyle } from '../../shared/constants/element';
import { ControlValue } from '@/client/shared/constants/control';
import { historyActions } from '@/client/stores/slices/historySlice';

const Panels = () => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.nodeProps.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

  const stylePanelEnabledOptions = useMemo<
    StylePanelProps['enabledOptions']
  >(() => {
    switch (selectedNode?.type) {
      case 'text':
        return { line: false, size: true };
      default:
        return { line: true, size: true };
    }
  }, [selectedNode]);

  const dispatch = useAppDispatch();

  const onToolTypeChange = (type: Tool['value']) => {
    dispatch(controlActions.setToolType(type));
  };

  const handleStyleChange = (style: NodeStyle) => {
    if (!selectedNode) return;

    const updatedNode = { ...selectedNode, style };

    dispatch(nodesActions.update([updatedNode]));
  };

  const dispatchActionByControlType = (type: ControlValue) => {
    switch (type) {
      case 'history/undo':
        dispatch(historyActions.undo());
        break;
      case 'history/redo':
        dispatch(historyActions.redo());
        break;
      case 'nodes/deleteAll':
        dispatch(nodesActions.deleteAll());
    }
  };

  return (
    <>
      <ToolsDock activeTool={toolType} onToolSelect={onToolTypeChange} />
      {selectedNode && (
        <StylePanel
          style={selectedNode.style}
          enabledOptions={stylePanelEnabledOptions}
          onStyleChange={handleStyleChange}
        />
      )}
      <ControlPanel
        onControl={dispatchActionByControlType}
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

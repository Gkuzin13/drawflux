import { RefObject, useMemo } from 'react';
import ControlPanel from './ControlPanel/ControlPanel';
import ToolsDock from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import StylePanel, { StylePanelProps } from './StylePanel/StylePanel';
import { useAppDispatch, useAppSelector } from '@/client/stores/hooks';
import {
  selectStageConfig,
  stageConfigActions,
  StageConfigState,
} from '@/client/stores/slices/stageConfigSlice';
import { nodesActions, selectNodes } from '@/client/stores/slices/nodesSlice';
import {
  controlActions,
  selectControl,
} from '@/client/stores/slices/controlSlice';
import { Tool } from '@/client/shared/constants/tool';
import { NodeStyle, NodeType } from '@/client/shared/constants/element';
import MenuPanel from './MenuPanel/MenuPanel';
import {
  downloadDataUrlAsFile,
  loadJsonFile,
} from '@/client/shared/utils/file';
import Konva from 'konva';
import { store } from '@/client/stores/store';
import { z } from 'zod';
import { modalActions } from '@/client/stores/slices/modalSlice';
import { MenuPanelActionType } from '@/client/shared/constants/menu';
import { NodeTypeSchema } from '../../../../schemas/nodeSchema'; // Temporary namespace

type Props = {
  stageRef: RefObject<Konva.Stage>;
};

const Panels = ({ stageRef }: Props) => {
  const { selectedNodeId, toolType } = useAppSelector(selectControl);
  const stageConfig = useAppSelector(selectStageConfig);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

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

  const onToolTypeChange = (type: Tool['value']) => {
    dispatch(controlActions.setToolType(type));
  };

  const handleStyleChange = (style: NodeStyle) => {
    if (!selectedNode) return;

    const updatedNode = { ...selectedNode, style };

    dispatch(nodesActions.update([updatedNode]));
  };

  const handleMenuAction = (type: MenuPanelActionType) => {
    switch (type) {
      case 'export-as-image': {
        const dataUrl = stageRef.current?.toDataURL();

        if (dataUrl) {
          downloadDataUrlAsFile(dataUrl, 'export-image');
        }
        break;
      }
      case 'export-as-json': {
        const state = store.getState();

        const stateToExport = {
          stageConfig: state.stageConfig,
          nodes: state.undoableNodes.present.nodes,
        };

        const dataUrl = URL.createObjectURL(
          new Blob([JSON.stringify(stateToExport)], {
            type: 'application/json',
          }),
        );

        downloadDataUrlAsFile(dataUrl, 'export-json');
        break;
      }
      case 'import-json': {
        const schema = z.object({
          nodes: NodeTypeSchema.array(),
          stageConfig: z.unknown(),
        });

        loadJsonFile<{ nodes: NodeType[]; stageConfig: StageConfigState }>(
          schema,
        ).then((state) => {
          if (!state) {
            dispatch(
              modalActions.open({
                title: 'Error',
                message: 'Could not load file',
              }),
            );
            return;
          }
          dispatch(nodesActions.set(state.nodes));
          dispatch(stageConfigActions.set(state.stageConfig));
        });
        break;
      }
    }
  };

  return (
    <>
      <MenuPanel onAction={handleMenuAction} />
      <ToolsDock activeTool={toolType} onToolSelect={onToolTypeChange} />
      {selectedNode && (
        <StylePanel
          style={selectedNode.style}
          enabledOptions={stylePanelEnabledOptions}
          onStyleChange={handleStyleChange}
        />
      )}
      <ControlPanel
        onControl={dispatch}
        enabledControls={{
          undo: Boolean(past.length),
          redo: Boolean(future.length),
          clear: Boolean(nodes.length),
        }}
      />
      <ZoomPanel value={stageConfig.scale} onZoomChange={dispatch} />
    </>
  );
};

export default Panels;

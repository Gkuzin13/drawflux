import { RefObject, useMemo } from 'react';
import ControlPanel from './ControlPanel/ControlPanel';
import ToolsDock from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import StylePanel, { StylePanelProps } from './StylePanel/StylePanel';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  selectStageConfig,
  stageConfigActions,
  StageConfigState,
} from '@/stores/slices/stageConfigSlice';
import { nodesActions, selectNodes } from '@/stores/slices/nodesSlice';
import { controlActions, selectControl } from '@/stores/slices/controlSlice';
import { Tool } from '@/constants/tool';
import MenuPanel from './MenuPanel/MenuPanel';
import { downloadDataUrlAsFile, loadJsonFile } from '@/utils/file';
import Konva from 'konva';
import { store } from '@/stores/store';
import { z } from 'zod';
import { modalActions } from '@/stores/slices/modalSlice';
import { MenuPanelActionType } from '@/constants/menu';
import { Schemas } from '@shared';
import type { NodeStyle, NodeObject } from '@shared';
import SharePanel from './SharePanel/SharePanel';

type Props = {
  stageRef: RefObject<Konva.Stage>;
  isPageShared?: boolean;
};

const Panels = ({ stageRef, isPageShared = false }: Props) => {
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
          nodes: Schemas.Node.array(),
          stageConfig: z.unknown(),
        });

        loadJsonFile<{ nodes: NodeObject[]; stageConfig: StageConfigState }>(
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
      <SharePanel
        isPageShared={isPageShared}
        pageState={{ page: { nodes, stageConfig } }}
      />
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

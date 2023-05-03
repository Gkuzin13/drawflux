import type Konva from 'konva';
import { type RefObject, useMemo } from 'react';
import type { NodeStyle, NodeObject, StageConfig } from 'shared';
import { Schemas } from 'shared';
import { z } from 'zod';
import type { ControlAction } from '@/constants/control';
import { type MenuPanelActionType } from '@/constants/menu';
import { type Tool } from '@/constants/tool';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import { modalActions } from '@/stores/slices/modalSlice';
import { nodesActions, selectNodes } from '@/stores/slices/nodesSlice';
import { store } from '@/stores/store';
import { downloadDataUrlAsFile, loadJsonFile } from '@/utils/file';
import ControlPanel from './ControlPanel/ControlPanel';
import MenuPanel from './MenuPanel/MenuPanel';
import SharePanel from './SharePanel/SharePanel';
import StylePanel, { type StylePanelProps } from './StylePanel/StylePanel';
import ToolsDock from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';

type Props = {
  stageRef: RefObject<Konva.Stage>;
  isPageShared?: boolean;
};

const Panels = ({ stageRef, isPageShared = false }: Props) => {
  const { stageConfig, toolType, selectedNodesIds } =
    useAppSelector(selectCanvas);
  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => selectedNodesIds[node.nodeProps.id]);
  }, [selectedNodesIds, nodes]);

  const enabledControls = useMemo(() => {
    return {
      undo: Boolean(past.length),
      redo: Boolean(future.length),
      deleteSelectedNodes: Boolean(Object.keys(selectedNodesIds).length),
    };
  }, [past, future, selectedNodesIds]);

  const stylePanelEnabledOptions = useMemo<
    StylePanelProps['enabledOptions']
  >(() => {
    const selectedNodesTypes = selectedNodes.map(({ type }) => type);

    if (selectedNodesTypes.includes('text')) {
      return { line: false, size: true };
    }

    return { line: true, size: true };
  }, [selectedNodes]);

  const selectedNodesStyle = useMemo<Partial<NodeStyle>>(() => {
    const styles: NodeStyle[] = selectedNodes.map(({ style }) => style);

    const colors = new Set(styles.map(({ color }) => color));
    const lines = new Map(styles.map(({ line }) => [`${line}`, line]));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const animated = styles.every(({ animated }) => animated);

    return {
      color: colors.size > 1 ? undefined : Array.from(colors)[0],
      line: lines.size > 1 ? undefined : Array.from(lines.values())[0],
      size: sizes.size > 1 ? undefined : Array.from(sizes)[0],
      opacity: opacities.size > 1 ? undefined : Array.from(opacities)[0],
      animated,
    };
  }, [selectedNodes]);

  const onToolTypeChange = (type: Tool['value']) => {
    dispatch(canvasActions.setToolType(type));
  };

  const handleStyleChange = (style: Partial<NodeStyle>) => {
    const updatedNodes = selectedNodes.map((node) => {
      return { ...node, style: { ...node.style, ...style } };
    });

    dispatch(nodesActions.update(updatedNodes));
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
          stageConfig: state.canvas.stageConfig,
          nodes: state.nodesHistory.present.nodes,
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

        loadJsonFile<{ nodes: NodeObject[]; stageConfig: StageConfig }>(
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
          dispatch(canvasActions.setStageConfig(state.stageConfig));
        });
        break;
      }
    }
  };

  const handleZoomChange = (value: number) => {
    dispatch(canvasActions.setStageConfig({ ...stageConfig, scale: value }));
  };

  const handleControlActions = (action: ControlAction) => {
    switch (action.type) {
      case 'nodes/delete': {
        dispatch(nodesActions.delete(Object.keys(selectedNodesIds)));
        dispatch(canvasActions.setSelectedNodesIds({}));
        break;
      }
      default: {
        dispatch(action());
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
      {selectedNodes.length ? (
        <StylePanel
          style={selectedNodesStyle}
          enabledOptions={stylePanelEnabledOptions}
          onStyleChange={handleStyleChange}
        />
      ) : null}
      <ControlPanel
        onControl={handleControlActions}
        enabledControls={enabledControls}
      />
      <ZoomPanel value={stageConfig.scale} onZoomChange={handleZoomChange} />
    </>
  );
};

export default Panels;

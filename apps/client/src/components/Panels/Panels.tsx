import type Konva from 'konva';
import { type RefObject, useMemo } from 'react';
import type { NodeStyle, NodeObject, StageConfig } from 'shared';
import { Schemas } from 'shared';
import { z } from 'zod';
import type { ControlAction } from '@/constants/control';
import { type MenuPanelActionType } from '@/constants/menu';
import { type Tool } from '@/constants/tool';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectCanvas,
  selectHistory,
} from '@/stores/slices/canvas';
import { uiActions } from '@/stores/slices/ui';
import { store } from '@/stores/store';
import { downloadDataUrlAsFile, loadJsonFile } from '@/utils/file';
import ControlPanel from './ControlPanel/ControlPanel';
import MenuPanel from './MenuPanel/MenuPanel';
import {
  BottomPanel,
  PanelsContainer,
  TopPanel,
  TopPanelRightContainer,
} from './PanelsStyled';
import SharePanel from './SharePanel/SharePanel';
import StylePanel, { type StylePanelProps } from './StylePanel/StylePanel';
import ToolsPanel from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';

type Props = {
  stageRef: RefObject<Konva.Stage>;
  intersectedNodesIds: string[];
  isPageShared?: boolean;
};

const Panels = ({
  stageRef,
  intersectedNodesIds,
  isPageShared = false,
}: Props) => {
  const { stageConfig, toolType, nodes } = useAppSelector(selectCanvas);
  const { past, future } = useAppSelector(selectHistory);

  const dispatch = useAppDispatch();

  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(intersectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [intersectedNodesIds, nodes]);

  const enabledControls = useMemo(() => {
    return {
      undo: Boolean(past.length),
      redo: Boolean(future.length),
      deleteSelectedNodes: Boolean(intersectedNodesIds.length),
    };
  }, [past, future, intersectedNodesIds]);

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
    const lines = new Set(styles.map(({ line }) => line));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const animated = styles.every(({ animated }) => animated);

    return {
      color: colors.size > 1 ? undefined : Array.from(colors)[0],
      line: lines.size > 1 ? undefined : Array.from(lines)[0],
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

    dispatch(canvasActions.updateNodes(updatedNodes));
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
        const state = store.getState().canvas.present;

        const stateToExport = {
          stageConfig: state.stageConfig,
          nodes: state.nodes,
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
              uiActions.openDialog({
                title: 'Error',
                description: 'Could not load file',
              }),
            );
            return;
          }
          dispatch(canvasActions.setNodes(state.nodes));
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
      case 'canvas/deleteNodes': {
        dispatch(canvasActions.deleteNodes(intersectedNodesIds));
        dispatch(canvasActions.setSelectedNodesIds([]));
        break;
      }
      default: {
        dispatch(action());
        break;
      }
    }
  };

  return (
    <PanelsContainer>
      <TopPanel>
        <ControlPanel
          onControl={handleControlActions}
          enabledControls={enabledControls}
        />
        <StylePanel
          active={selectedNodes.length > 0}
          style={selectedNodesStyle}
          enabledOptions={stylePanelEnabledOptions}
          onStyleChange={handleStyleChange}
        />
        <ZoomPanel value={stageConfig.scale} onZoomChange={handleZoomChange} />
        <TopPanelRightContainer>
          <SharePanel
            isPageShared={isPageShared}
            pageState={{ page: { nodes, stageConfig } }}
          />
          <MenuPanel onAction={handleMenuAction} />
        </TopPanelRightContainer>
      </TopPanel>
      <BottomPanel>
        <ToolsPanel activeTool={toolType} onToolSelect={onToolTypeChange} />
      </BottomPanel>
    </PanelsContainer>
  );
};

export default Panels;

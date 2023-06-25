import type Konva from 'konva';
import { type RefObject, useMemo } from 'react';
import type { NodeStyle, NodeObject, StageConfig, WSMessage } from 'shared';
import { Schemas, WSMessageUtil } from 'shared';
import type { ControlAction } from '@/constants/control';
import { type MenuPanelActionType } from '@/constants/menu';
import { type Tool } from '@/constants/tool';
import useNetworkState from '@/hooks/useNetworkState/useNetworkState';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectCanvas,
  selectHistory,
  updatePage,
} from '@/stores/slices/canvas';
import { uiActions } from '@/stores/slices/ui';
import { store } from '@/stores/store';
import { downloadDataUrlAsFile, loadJsonFile } from '@/utils/file';
import { sendMessage } from '@/utils/websocket';
import { useWebSocket } from '@/webSocketContext';
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

  const ws = useWebSocket();
  const { online } = useNetworkState();

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

  const selectedNodesStyle = useMemo(() => {
    const styles: NodeStyle[] = selectedNodes.map(({ style }) => style);

    const colors = new Set(styles.map(({ color }) => color));
    const lines = new Set(styles.map(({ line }) => line));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const allShapesAnimated = styles.every(({ animated }) => animated);

    const getValueIfAllIdentical = <T extends string | number | boolean>(
      set: Set<T>,
    ): T | undefined => {
      return set.size === 1 ? [...set][0] : undefined;
    };

    return {
      color: getValueIfAllIdentical(colors),
      line: getValueIfAllIdentical(lines),
      size: getValueIfAllIdentical(sizes),
      opacity: getValueIfAllIdentical(opacities),
      animated: allShapesAnimated,
    };
  }, [selectedNodes]);

  const isStylePanelActive = selectedNodes.length > 0;

  const handleToolSelect = (type: Tool['value']) => {
    dispatch(canvasActions.setToolType(type));
  };

  const handleStyleChange = (style: Partial<NodeStyle>) => {
    const updatedNodes = selectedNodes.map((node) => {
      return { ...node, style: { ...node.style, ...style } };
    });

    dispatch(canvasActions.updateNodes(updatedNodes));

    if (ws?.isConnected) {
      const message: WSMessage = {
        type: 'nodes-update',
        data: { nodes: updatedNodes },
      };

      sendMessage(ws.connection, message);

      const currentNodes = store.getState().canvas.present.nodes;
      dispatch(updatePage({ id: ws.pageId, body: { nodes: currentNodes } }));
    }
  };

  const handleMenuAction = async (type: MenuPanelActionType) => {
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
        try {
          const jsonData = await loadJsonFile<{
            nodes: NodeObject[];
            stageConfig: StageConfig;
          }>(Schemas.Page.shape.page);

          if (!jsonData) {
            throw new Error('Could not load file');
          }

          dispatch(
            canvasActions.set({ ...jsonData, toolType, selectedNodesIds: {} }),
          );
        } catch (error) {
          if (error instanceof Error) {
            dispatch(
              uiActions.openDialog({
                title: 'Error',
                description: error.message as string,
              }),
            );
          }
        }
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

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-delete',
            data: { nodesIds: intersectedNodesIds },
          };

          sendMessage(ws.connection, message);
        }
        break;
      }
      default: {
        dispatch(action());
        if (ws?.isConnected) {
          const currentNodes = store.getState().canvas.present.nodes;
          const message: WSMessage = {
            type: 'nodes-set',
            data: { nodes: currentNodes },
          };

          sendMessage(ws.connection, message);
        }
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
          active={isStylePanelActive}
          style={selectedNodesStyle}
          enabledOptions={stylePanelEnabledOptions}
          onStyleChange={handleStyleChange}
        />
        <ZoomPanel value={stageConfig.scale} onZoomChange={handleZoomChange} />
        <TopPanelRightContainer>
          {online && (
            <SharePanel
              isPageShared={isPageShared}
              pageState={{ page: { nodes, stageConfig } }}
            />
          )}
          <MenuPanel onAction={handleMenuAction} />
        </TopPanelRightContainer>
      </TopPanel>
      <BottomPanel>
        <ToolsPanel activeTool={toolType} onToolSelect={handleToolSelect} />
      </BottomPanel>
    </PanelsContainer>
  );
};

export default Panels;

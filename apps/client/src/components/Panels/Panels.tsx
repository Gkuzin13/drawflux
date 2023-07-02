import type Konva from 'konva';
import { type RefObject, useMemo, useEffect, lazy, Suspense } from 'react';
import type {
  NodeStyle,
  NodeObject,
  StageConfig,
  WSMessage,
  UpdatePageResponse,
  UpdatePageRequestBody,
  User,
} from 'shared';
import { Schemas } from 'shared';
import type { ControlAction } from '@/constants/panels/control';
import { type MenuPanelActionType } from '@/constants/panels/menu';
import { type Tool } from '@/constants/panels/tools';
import { useModal } from '@/contexts/modal';
import { useNotifications } from '@/contexts/notifications';
import { useWebSocket } from '@/contexts/websocket';
import useFetch from '@/hooks/useFetch';
import useNetworkState from '@/hooks/useNetworkState/useNetworkState';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectCanvas,
  selectHistory,
} from '@/stores/slices/canvas';
import { collaborationActions } from '@/stores/slices/collaboration';
import { store } from '@/stores/store';
import { downloadDataUrlAsFile, loadJsonFile } from '@/utils/file';
import { sendMessage } from '@/utils/websocket';
import ControlPanel from './ControlPanel/ControlPanel';
import MenuPanel from './MenuPanel/MenuPanel';
import * as Styled from './Panels.styled';
import SharePanel from './SharePanel/SharePanel';
import StylePanel, { type StylePanelProps } from './StylePanel/StylePanel';
import ToolsPanel from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';

type Props = {
  stageRef: RefObject<Konva.Stage>;
  intersectedNodesIds: string[];
};

const UsersPanel = lazy(() => import('./UsersPanel/UsersPanel'));

const Panels = ({ stageRef, intersectedNodesIds }: Props) => {
  const ws = useWebSocket();

  const [{ error }, updatePage] = useFetch<
    UpdatePageResponse,
    UpdatePageRequestBody
  >(
    `/p/${ws?.pageId}`,
    {
      method: 'PATCH',
    },
    { skip: true },
  );

  const { stageConfig, toolType, nodes } = useAppSelector(selectCanvas);
  const { past, future } = useAppSelector(selectHistory);
  const { online } = useNetworkState();

  const modal = useModal();
  const notifications = useNotifications();

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

  useEffect(() => {
    if (error) {
      notifications.add({
        title: 'Error',
        description: 'Could not update page',
        type: 'error',
      });
    }
  }, [error, notifications]);

  const handleToolSelect = (type: Tool['value']) => {
    dispatch(canvasActions.setToolType(type));
  };

  const handleUpdatePage = () => {
    const currentNodes = store.getState().canvas.present.nodes;
    updatePage({ nodes: currentNodes });
  };

  const handleStyleChange = (style: Partial<NodeStyle>) => {
    const updatedNodes = selectedNodes.map((node) => {
      return { ...node, style: { ...node.style, ...style } };
    });

    dispatch(canvasActions.updateNodes(updatedNodes));

    if (ws?.isConnected && ws.pageId) {
      const message: WSMessage = {
        type: 'nodes-update',
        data: { nodes: updatedNodes },
      };

      sendMessage(ws.connection, message);

      handleUpdatePage();
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
            modal.open('Error', error.message as string);
          }
        }
      }
    }
  };

  const handleZoomChange = (value: number) => {
    dispatch(canvasActions.setStageConfig({ ...stageConfig, scale: value }));
  };

  const handleControlActions = (action: ControlAction) => {
    if (action.type === 'canvas/deleteNodes') {
      dispatch(canvasActions.deleteNodes(intersectedNodesIds));

      if (ws?.isConnected) {
        const message: WSMessage = {
          type: 'nodes-delete',
          data: { nodesIds: intersectedNodesIds },
        };

        sendMessage(ws.connection, message);
      }
      return;
    }

    dispatch(action());

    if (ws?.isConnected) {
      const historyAction = action.type === 'history/redo' ? 'redo' : 'undo';

      const message: WSMessage = {
        type: 'history-change',
        data: { action: historyAction },
      };

      sendMessage(ws.connection, message);
      handleUpdatePage();
    }
  };

  const handleUserChange = (user: User) => {
    if (ws?.isConnected) {
      const message: WSMessage = {
        type: 'user-change',
        data: { user },
      };

      sendMessage(ws.connection, message);

      dispatch(collaborationActions.updateUser(user));
    }
  };

  return (
    <Styled.Container>
      <Styled.TopPanel>
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
        {ws?.isConnected && (
          <Suspense>
            <UsersPanel onUserChange={handleUserChange} />
          </Suspense>
        )}
        <Styled.TopPanelRightContainer>
          {online && (
            <SharePanel
              isPageShared={!!ws?.isConnected}
              pageState={{ page: { nodes, stageConfig } }}
            />
          )}
          <MenuPanel onAction={handleMenuAction} />
        </Styled.TopPanelRightContainer>
      </Styled.TopPanel>
      <Styled.BottomPanel>
        <ToolsPanel activeTool={toolType} onToolSelect={handleToolSelect} />
      </Styled.BottomPanel>
    </Styled.Container>
  );
};

export default Panels;

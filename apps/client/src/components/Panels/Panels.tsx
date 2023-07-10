import type Konva from 'konva';
import { type RefObject, useMemo, lazy, Suspense, useCallback } from 'react';
import type { NodeStyle, WSMessage, User } from 'shared';
import type { ControlAction } from '@/constants/panels/control';
import { type MenuPanelActionType } from '@/constants/panels/menu';
import { type Tool } from '@/constants/panels/tools';
import { useModal } from '@/contexts/modal';
import { useWebSocket } from '@/contexts/websocket';
import useNetworkState from '@/hooks/useNetworkState/useNetworkState';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectCanvas,
  selectHistory,
} from '@/stores/slices/canvas';
import { collaborationActions } from '@/stores/slices/collaboration';
import { store } from '@/stores/store';
import { downloadDataUrlAsFile, importProject } from '@/utils/file';
import { sendMessage } from '@/utils/websocket';
import ControlPanel from './ControlPanel/ControlPanel';
import MenuPanel, { type MenuKey } from './MenuPanel/MenuPanel';
import * as Styled from './Panels.styled';
import SharePanel from './SharePanel/SharePanel';
import StylePanel from './StylePanel/StylePanel';
import ToolsPanel from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import usePageMutation from '@/hooks/usePageMutation';
import { PROJECT_FILE_EXT, PROJECT_FILE_NAME } from '@/constants/app';

type Props = {
  stageRef: RefObject<Konva.Stage>;
  intersectedNodesIds: string[];
};

const UsersPanel = lazy(() => import('./UsersPanel/UsersPanel'));

const Panels = ({ stageRef, intersectedNodesIds }: Props) => {
  const ws = useWebSocket();

  const { updatePage } = usePageMutation(ws?.pageId ?? '');

  const { stageConfig, toolType, nodes } = useAppSelector(selectCanvas);
  const { past, future } = useAppSelector(selectHistory);
  const { online } = useNetworkState();

  const modal = useModal();

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

  const disabledMenuItems = useMemo((): MenuKey[] | null => {
    if (ws?.isConnected) {
      return ['open'];
    }
    return null;
  }, [ws]);

  const handleToolSelect = useCallback(
    (type: Tool['value']) => {
      dispatch(canvasActions.setToolType(type));
    },
    [dispatch],
  );

  const handleUpdatePage = useCallback(() => {
    const currentNodes = store.getState().canvas.present.nodes;
    updatePage({ nodes: currentNodes });
  }, [updatePage]);

  const handleStyleChange = useCallback(
    (style: Partial<NodeStyle>, updateAsync = true) => {
      const { selectedNodesIds, nodes } = store.getState().canvas.present;

      const updatedNodes = nodes
        .filter((node) => node.nodeProps.id in selectedNodesIds)
        .map((node) => {
          return { ...node, style: { ...node.style, ...style } };
        });

      dispatch(canvasActions.updateNodes(updatedNodes));

      if (ws?.isConnected && ws.pageId) {
        const message: WSMessage = {
          type: 'nodes-update',
          data: updatedNodes,
        };

        sendMessage(ws.connection, message);

        updateAsync && handleUpdatePage();
      }
    },
    [ws, dispatch, handleUpdatePage],
  );

  const handleMenuAction = useCallback(
    (type: MenuPanelActionType) => {
      switch (type) {
        case 'export-as-image': {
          const dataUrl = stageRef.current?.toDataURL();

          if (dataUrl) {
            downloadDataUrlAsFile(dataUrl, PROJECT_FILE_NAME, PROJECT_FILE_EXT);
          }
          break;
        }
        case 'save': {
          const state = store.getState().canvas.present;

          const dataUrl = URL.createObjectURL(
            new Blob([JSON.stringify(state)], {
              type: 'application/json',
            }),
          );

          downloadDataUrlAsFile(dataUrl, PROJECT_FILE_NAME, PROJECT_FILE_EXT);
          break;
        }
        case 'open': {
          const openProject = async () => {
            const project = await importProject();

            if (project) {
              dispatch(canvasActions.set(project));
            } else {
              modal.open('Error', 'Could not load file');
            }
          };

          openProject();
        }
      }
    },
    [dispatch, modal, stageRef],
  );

  const handleZoomChange = useCallback(
    (value: number) => {
      dispatch(canvasActions.setStageConfig({ ...stageConfig, scale: value }));
    },
    [stageConfig, dispatch],
  );

  const handleControlActions = useCallback(
    (action: ControlAction) => {
      if (action.type === 'canvas/deleteNodes') {
        dispatch(canvasActions.deleteNodes(intersectedNodesIds));

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-delete',
            data: intersectedNodesIds,
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
    },
    [ws, intersectedNodesIds, dispatch, handleUpdatePage],
  );

  const handleUserChange = useCallback(
    (user: User) => {
      if (ws?.isConnected) {
        const message: WSMessage = {
          type: 'user-change',
          data: user,
        };

        sendMessage(ws.connection, message);

        dispatch(collaborationActions.updateUser(user));
      }
    },
    [ws, dispatch],
  );

  return (
    <Styled.Container>
      <Styled.TopPanel>
        <ControlPanel
          onControl={handleControlActions}
          enabledControls={enabledControls}
        />
        <StylePanel
          selectedNodes={selectedNodes}
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
            <SharePanel isPageShared={ws?.isConnected ? true : false} />
          )}
          <MenuPanel
            disabledItems={disabledMenuItems}
            onAction={handleMenuAction}
          />
        </Styled.TopPanelRightContainer>
      </Styled.TopPanel>
      <Styled.BottomPanel>
        <ToolsPanel activeTool={toolType} onToolSelect={handleToolSelect} />
      </Styled.BottomPanel>
    </Styled.Container>
  );
};

export default Panels;

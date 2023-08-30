import type Konva from 'konva';
import { type RefObject, useMemo, lazy, Suspense, useCallback } from 'react';
import type { NodeStyle, User } from 'shared';
import { type MenuPanelActionType } from '@/constants/panels/menu';
import { type ToolType } from '@/constants/panels/tools';
import { useModal } from '@/contexts/modal';
import { useWebSocket } from '@/contexts/websocket';
import useNetworkState from '@/hooks/useNetworkState/useNetworkState';
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectHistory,
  selectNodes,
  selectToolType,
} from '@/stores/slices/canvas';
import { collaborationActions } from '@/stores/slices/collaboration';
import { downloadDataUrlAsFile, importProject } from '@/utils/file';
import ControlPanel, {
  type ControlActionKey,
} from './ControlPanel/ControlPanel';
import MenuPanel, { type MenuKey } from './MenuPanel/MenuPanel';
import * as Styled from './Panels.styled';
import SharePanel from './SharePanel/SharePanel';
import StylePanel from './StylePanel/StylePanel';
import ToolsPanel from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import usePageMutation from '@/hooks/usePageMutation';
import { PROJECT_FILE_EXT, PROJECT_FILE_NAME } from '@/constants/app';
import { historyActions } from '@/stores/reducers/history';

type Props = {
  selectedNodesIds: string[];
  stageRef: RefObject<Konva.Stage>;
};

const UsersPanel = lazy(() => import('./UsersPanel/UsersPanel'));

const Panels = ({ selectedNodesIds, stageRef }: Props) => {
  const store = useAppStore();
  const ws = useWebSocket();

  const { updatePage } = usePageMutation();

  const stageConfig = useAppSelector(selectConfig);
  const toolType = useAppSelector(selectToolType);
  const nodes = useAppSelector(selectNodes);

  const { past, future } = useAppSelector(selectHistory);

  const { online } = useNetworkState();

  const modal = useModal();

  const isHandTool = toolType === 'hand';

  const dispatch = useAppDispatch();

  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const isStylePanelActive = useMemo(() => {
    return selectedNodes.length > 0 && !isHandTool;
  }, [selectedNodes.length, isHandTool]);

  const enabledControls = useMemo(() => {
    return {
      undo: Boolean(past.length),
      redo: Boolean(future.length),
      deleteSelectedNodes: Boolean(selectedNodesIds.length),
    };
  }, [past, future, selectedNodesIds]);

  const disabledMenuItems = useMemo((): MenuKey[] | null => {
    if (ws.isConnected) {
      return ['open'];
    }
    return null;
  }, [ws]);

  const handleToolSelect = useCallback(
    (type: ToolType) => {
      dispatch(canvasActions.setToolType(type));
    },
    [dispatch],
  );

  const handleUpdatePage = useCallback(() => {
    const currentNodes = store.getState().canvas.present.nodes;
    updatePage({ nodes: currentNodes });
  }, [store, updatePage]);

  const handleStyleChange = useCallback(
    (style: Partial<NodeStyle>, updateAsync = true) => {
      const { nodes, selectedNodesIds } = store.getState().canvas.present;

      const updatedNodes = nodes
        .filter((node) => node.nodeProps.id in selectedNodesIds)
        .map((node) => {
          return { ...node, style: { ...node.style, ...style } };
        });

      dispatch(canvasActions.updateNodes(updatedNodes));

      if (ws.isConnected) {
        ws.send({ type: 'nodes-update', data: updatedNodes });

        updateAsync && handleUpdatePage();
      }
    },
    [ws, store, handleUpdatePage, dispatch],
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
              modal.open({
                title: 'Error',
                description: 'Could not load file',
              });
            }
          };

          openProject();
        }
      }
    },
    [store, modal, stageRef, dispatch],
  );

  const handleZoomChange = useCallback(
    (value: number) => {
      dispatch(canvasActions.setStageConfig({ ...stageConfig, scale: value }));
    },
    [stageConfig, dispatch],
  );

  const handleControlActions = useCallback(
    (actionType: ControlActionKey) => {
      if (actionType === 'deleteNodes') {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));

        if (ws.isConnected) {
          ws.send({
            type: 'nodes-delete',
            data: selectedNodesIds,
          });
        }
        return;
      }

      if (actionType === 'undo' || actionType === 'redo') {
        const action = historyActions[actionType];

        dispatch(action());

        if (ws.isConnected) {
          const historyAction = actionType === 'redo' ? 'redo' : 'undo';
          ws.send({ type: 'history-change', data: { action: historyAction } });

          handleUpdatePage();
        }
      }
    },
    [ws, selectedNodesIds, dispatch, handleUpdatePage],
  );

  const handleUserChange = useCallback(
    (user: User) => {
      if (ws.isConnected) {
        ws.send({ type: 'user-change', data: user });

        dispatch(collaborationActions.updateUser(user));
      }
    },
    [ws, dispatch],
  );

  return (
    <Styled.Container>
      <Styled.TopPanel>
        {!isHandTool && (
          <ControlPanel
            onControl={handleControlActions}
            enabledControls={enabledControls}
          />
        )}
        <StylePanel
          selectedNodes={selectedNodes}
          isActive={isStylePanelActive}
          onStyleChange={handleStyleChange}
        />
        <ZoomPanel value={stageConfig.scale} onZoomChange={handleZoomChange} />
        {ws.isConnected && (
          <Suspense>
            <UsersPanel onUserChange={handleUserChange} />
          </Suspense>
        )}
        <Styled.TopPanelRightContainer>
          {online && <SharePanel isPageShared={ws.isConnected} />}
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

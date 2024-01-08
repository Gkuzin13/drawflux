import { useMemo, lazy, Suspense, useCallback } from 'react';
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
} from '@/services/canvas/slice';
import { collaborationActions } from '@/services/collaboration/slice';
import { downloadDataUrlAsFile, importProject } from '@/utils/file';
import ControlPanel, {
  type ControlActionKey,
} from './ControlPanel/ControlPanel';
import MenuPanel, { type MenuKey } from './MenuPanel/MenuPanel';
import SharePanel from './SharePanel/SharePanel';
import StylePanel from './StylePanel/StylePanel';
import ToolsPanel from './ToolsPanel/ToolsPanel';
import ZoomPanel from './ZoomPanel/ZoomPanel';
import LibraryDrawer from '../Library/LibraryDrawer/LibraryDrawer';
import { PROJECT_FILE_EXT, PROJECT_FILE_NAME } from '@/constants/app';
import { historyActions } from '@/stores/reducers/history';
import { selectLibrary } from '@/services/library/slice';
import { calculateCenterPoint } from '@/utils/position';
import { calculateStageZoomRelativeToPoint } from '../Canvas/DrawingCanvas/helpers/zoom';
import * as Styled from './Panels.styled';
import { type MenuPanelActionType } from '@/constants/panels/menu';
import { type ToolType } from '@/constants/panels/tools';
import type Konva from 'konva';
import type { NodeStyle, User } from 'shared';
import type { ZoomAction } from '@/constants/panels/zoom';

type Props = {
  selectedNodesIds: string[];
  stageRef: React.RefObject<Konva.Stage>;
};

const UsersPanel = lazy(() => import('./UsersPanel/UsersPanel'));

const Panels = ({ selectedNodesIds, stageRef }: Props) => {
  const store = useAppStore();
  const ws = useWebSocket();

  const stageConfig = useAppSelector(selectConfig);
  const toolType = useAppSelector(selectToolType);
  const nodes = useAppSelector(selectNodes);
  const library = useAppSelector(selectLibrary);

  const { past, future } = useAppSelector(selectHistory);
  const { online } = useNetworkState();

  const modal = useModal();

  const dispatch = useAppDispatch();

  const isHandTool = toolType === 'hand';

  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const isStylePanelActive = useMemo(() => {
    return selectedNodes.length > 0 && !isHandTool;
  }, [selectedNodes.length, isHandTool]);

  const enabledControls = useMemo(() => {
    return {
      undo: Boolean(past.length) && !ws.isConnected,
      redo: Boolean(future.length) && !ws.isConnected,
      deleteSelectedNodes: Boolean(selectedNodesIds.length),
    };
  }, [ws, past, future, selectedNodesIds]);

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

  const handleStyleChange = useCallback(
    (style: Partial<NodeStyle>) => {
      const { nodes, selectedNodesIds } = store.getState().canvas.present;

      const updatedNodes = nodes
        .filter((node) => node.nodeProps.id in selectedNodesIds)
        .map((node) => {
          return { ...node, style: { ...node.style, ...style } };
        });

      dispatch(canvasActions.updateNodes(updatedNodes));
    },
    [store, dispatch],
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
    (action: ZoomAction) => {
      const stagePosition = stageConfig.position;
      const oldScale = stageConfig.scale;
      const viewportCenter = calculateCenterPoint(
        window.innerWidth,
        window.innerHeight,
      );

      const direction = action === 'reset' ? 0 : action === 'in' ? 1 : -1;

      const updatedStageConfig = calculateStageZoomRelativeToPoint(
        oldScale,
        viewportCenter,
        stagePosition,
        direction,
      );

      dispatch(canvasActions.setStageConfig(updatedStageConfig));
    },
    [stageConfig, dispatch],
  );

  const handleControlActions = useCallback(
    (actionType: ControlActionKey) => {
      if (actionType === 'deleteNodes') {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));
        return;
      }

      if (!ws.isConnected && (actionType === 'undo' || actionType === 'redo')) {
        const action = historyActions[actionType];
        dispatch(action());
      }
    },
    [ws, selectedNodesIds, dispatch],
  );

  const handleUserChange = useCallback(
    (user: User) => {
      dispatch(collaborationActions.updateUser(user));
    },
    [dispatch],
  );

  return (
    <Styled.Container>
      <Styled.TopPanels>
        {!isHandTool && (
          <ControlPanel
            onControl={handleControlActions}
            enabledControls={enabledControls}
          />
        )}
        {isStylePanelActive && (
          <StylePanel
            selectedNodes={selectedNodes}
            onStyleChange={handleStyleChange}
          />
        )}
        {ws.isConnected && (
          <Suspense>
            <UsersPanel onUserChange={handleUserChange} />
          </Suspense>
        )}
        <Styled.Panel css={{ marginLeft: 'auto' }}>
          {online && <SharePanel isPageShared={ws.isConnected} />}
          <LibraryDrawer items={library.items} />
          <MenuPanel
            disabledItems={disabledMenuItems}
            onAction={handleMenuAction}
          />
        </Styled.Panel>
      </Styled.TopPanels>
      <Styled.BottomPanels direction={{ '@initial': 'column', '@xs': 'row' }}>
        <ZoomPanel value={stageConfig.scale} onZoomChange={handleZoomChange} />
        <ToolsPanel activeTool={toolType} onToolSelect={handleToolSelect} />
      </Styled.BottomPanels>
    </Styled.Container>
  );
};

export default Panels;

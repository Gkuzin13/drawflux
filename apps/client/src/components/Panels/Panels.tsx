import { useMemo, lazy, Suspense, useCallback, memo } from 'react';
import { useModal } from '@/contexts/modal';
import { useWebSocket } from '@/contexts/websocket';
import useNetworkState from '@/hooks/useNetworkState/useNetworkState';
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectFutureHistory,
  selectPastHistory,
  selectToolType,
} from '@/services/canvas/slice';
import { collaborationActions } from '@/services/collaboration/slice';
import { downloadDataUrlAsFile, importProject } from '@/utils/file';
import MenuPanel, { type MenuKey } from './MenuPanel/MenuPanel';
import SharePanel from './SharePanel/SharePanel';
import StylePanel from './StylePanel/StylePanel';
import ToolButtons from './ToolButtons/ToolButtons';
import ZoomButtons from './ZoomButtons';
import LibraryDrawer from '../Library/LibraryDrawer/LibraryDrawer';
import HistoryButtons from './HistoryButtons';
import DeleteButton from './DeleteButton';
import { PROJECT_FILE_EXT, PROJECT_FILE_NAME } from '@/constants/app';
import { historyActions } from '@/stores/reducers/history';
import { selectLibrary } from '@/services/library/slice';
import { calculateCenterPoint } from '@/utils/position';
import { calculateStageZoomRelativeToPoint } from '../Canvas/DrawingCanvas/helpers/zoom';
import * as Styled from './Panels.styled';
import Konva from 'konva';
import type { NodeStyle, User } from 'shared';
import type {
  HistoryControlKey,
  MenuPanelActionType,
  ZoomActionKey,
} from '@/constants/panels';
import type { ToolType } from '@/constants/app';

type Props = {
  selectedNodeIds: string[];
};

const UsersPanel = lazy(() => import('./UsersPanel/UsersPanel'));

const Panels = ({ selectedNodeIds }: Props) => {
  const store = useAppStore();
  const ws = useWebSocket();

  const stageConfig = useAppSelector(selectConfig);
  const toolType = useAppSelector(selectToolType);
  const library = useAppSelector(selectLibrary);
  const past = useAppSelector(selectPastHistory);
  const future = useAppSelector(selectFutureHistory);

  const { online } = useNetworkState();

  const modal = useModal();

  const dispatch = useAppDispatch();

  const isHandTool = useMemo(() => toolType === 'hand', [toolType]);

  const isStylePanelActive = useMemo(() => {
    return selectedNodeIds.length > 0 && !isHandTool;
  }, [selectedNodeIds.length, isHandTool]);

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
      const { nodes, selectedNodeIds } = store.getState().canvas.present;

      const updatedNodes = nodes
        .filter((node) => node.nodeProps.id in selectedNodeIds)
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
          const dataUrl = Konva.stages[0].toDataURL();

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
    [store, modal, dispatch],
  );

  const handleZoomChange = useCallback(
    (action: ZoomActionKey) => {
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

  const handleHistoryAction = useCallback(
    (type: HistoryControlKey) => {
      const action = historyActions[type];

      if (action) {
        dispatch(action());
      }
    },
    [dispatch],
  );

  const handleUserChange = useCallback(
    (user: User) => {
      dispatch(collaborationActions.updateUser(user));
    },
    [dispatch],
  );

  const handleNodesDelete = useCallback(() => {
    dispatch(canvasActions.deleteNodes(selectedNodeIds));
  }, [selectedNodeIds, dispatch]);
  
  return (
    <Styled.Container>
      <Styled.TopPanels>
        {!isHandTool && (
          <Styled.Panel>
            <HistoryButtons
              disabledUndo={!past.length || ws.isConnected}
              disabledRedo={!future.length || ws.isConnected}
              onClick={handleHistoryAction}
            />
            <DeleteButton
              disabled={!selectedNodeIds.length}
              onClick={handleNodesDelete}
            />
          </Styled.Panel>
        )}
        {isStylePanelActive && (
          <StylePanel
            selectedNodeIds={selectedNodeIds}
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
        <Styled.Panel css={{ '@xs': { marginRight: 'auto' } }}>
          <ZoomButtons
            value={stageConfig.scale}
            onZoomChange={handleZoomChange}
          />
        </Styled.Panel>
        <Styled.Panel css={{ height: '100%' }}>
          <ToolButtons activeTool={toolType} onToolSelect={handleToolSelect} />
        </Styled.Panel>
      </Styled.BottomPanels>
    </Styled.Container>
  );
};

export default memo(Panels);

import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Panels from './components/Panels/Panels';
import Loader from './components/Elements/Loader/Loader';
import ContextMenu from './components/ContextMenu/ContextMenu';
import { useAppDispatch, useAppStore } from '@/stores/hooks';
import { canvasActions } from '@/services/canvas/slice';
import { storage } from '@/utils/storage';
import useParam from './hooks/useParam/useParam';
import { useWebSocket } from './contexts/websocket';
import { useNotifications } from './contexts/notifications';
import { urlSearchParam } from './utils/url';
import useWindowSize from './hooks/useWindowSize/useWindowSize';
import useAutoFocus from './hooks/useAutoFocus/useAutoFocus';
import {
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_LIBRARY_KEY,
  BASE_WS_URL,
  BASE_WS_URL_DEV,
  IS_PROD,
} from '@/constants/app';
import { CONSTANTS } from 'shared';
import { TOOLS } from './constants/panels';
import { KEYS } from './constants/keys';
import { libraryActions } from '@/services/library/slice';
import { historyActions } from './stores/reducers/history';
import api from './services/api';
import {
  addCollabActionsListeners,
  subscribeToIncomingCollabMessages,
} from './services/collaboration/listeners';
import {
  getIntersectingNodes,
  getLayerNodes,
  getLayerTransformers,
  getMainLayer,
  getPointerRect,
  haveIntersection,
} from './components/Canvas/DrawingCanvas/helpers/stage';
import * as Styled from './App.styled';
import type { Library, AppState } from '@/constants/app';
import type { HistoryActionKey } from './stores/reducers/history';
import type Konva from 'konva';
import type { ContextMenuType } from './components/ContextMenu/ContextMenu';

const DrawingCanvas = lazy(
  () => import('./components/Canvas/DrawingCanvas/DrawingCanvas'),
);

const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;

const createCollabRoomUrl = (roomId: string) => {
  return urlSearchParam.set(
    'id',
    roomId,
    `${wsBaseUrl}/${CONSTANTS.COLLAB_ROOM_URL_PARAM}`,
  );
};

const App = () => {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [menuType, setMenuType] = useState<ContextMenuType>('canvas-menu');

  const store = useAppStore();
  const roomId = useParam(CONSTANTS.COLLAB_ROOM_URL_PARAM);
  const windowSize = useWindowSize();
  const ws = useWebSocket();

  const appWrapperRef = useAutoFocus<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage>(null);

  const { addNotification } = useNotifications();
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const state = store.getState().canvas.present;

      const { key, shiftKey, ctrlKey } = event;
      const lowerCaseKey = key.toLowerCase();

      const onCtrlKey = (key: string) => {
        switch (key) {
          case KEYS.A: {
            event.preventDefault();
            dispatch(canvasActions.selectAllNodes());
            break;
          }
          case KEYS.Z: {
            if (ws.isConnected) {
              return;
            }
            const actionKey: HistoryActionKey = shiftKey ? 'redo' : 'undo';
            const action = historyActions[actionKey];

            dispatch(action());
            break;
          }
          case KEYS.D: {
            event.preventDefault();

            const selectedNodes = state.nodes.filter(
              (node) => node.nodeProps.id in state.selectedNodeIds,
            );

            dispatch(
              canvasActions.addNodes(selectedNodes, {
                duplicate: true,
                selectNodes: true,
              }),
            );
            break;
          }
          case KEYS.C: {
            dispatch(canvasActions.copyNodes());
            break;
          }
          case KEYS.V: {
            dispatch(
              canvasActions.addNodes(state.copiedNodes, {
                duplicate: true,
                selectNodes: true,
              }),
            );
            break;
          }
        }
      };

      if (ctrlKey) {
        return onCtrlKey(lowerCaseKey);
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(Object.keys(state.selectedNodeIds)));
        return;
      }

      const toolTypeObj = TOOLS.find((tool) => tool.key === lowerCaseKey);
      toolTypeObj && dispatch(canvasActions.setToolType(toolTypeObj.value));
    },
    [ws, store, dispatch],
  );

  const handleContextMenuOpen = useCallback(
    (open: boolean) => {
      const stage = stageRef.current;
      const pointerPosition = stage?.getPointerPosition();

      if (!stage || !pointerPosition || !open) {
        return;
      }

      const pointerRect = getPointerRect(pointerPosition, stage.scaleX());
      const layer = getMainLayer(stage);
      const layerTransformer = getLayerTransformers(layer)[0];

      if (layerTransformer) {
        const clickedOnTransformer = haveIntersection(
          layerTransformer.getClientRect(),
          pointerRect,
        );

        if (clickedOnTransformer) {
          setMenuType((prevType) => {
            return prevType === 'node-menu' ? prevType : 'node-menu';
          });
          return;
        }
      }

      const layerNodes = getLayerNodes(layer);
      const nodesInClickArea = getIntersectingNodes(layerNodes, pointerRect);
      const clickedOnNodes = Boolean(nodesInClickArea.length);

      if (clickedOnNodes) {
        const nodesIds = nodesInClickArea.map((node) => node.id());
        dispatch(canvasActions.setSelectedNodeIds(nodesIds));
        setMenuType('node-menu');
        return;
      }

      dispatch(canvasActions.setSelectedNodeIds([]));
      setMenuType('canvas-menu');
    },
    [dispatch],
  );

  useEffect(() => {
    if (!roomId) return;

    const [request, abortController] = api.getPage(roomId);

    request.then(({ page }) => {
      dispatch(canvasActions.setNodes(page.nodes, { broadcast: false }));
    });

    return () => {
      if (abortController.signal) {
        abortController.abort();
      }
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    if (!roomId) return;

    const wsUrl = createCollabRoomUrl(roomId);

    ws.connect(wsUrl);

    const subscribers = subscribeToIncomingCollabMessages(ws, dispatch);

    return () => {
      subscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [ws, roomId, dispatch]);

  useEffect(() => {
    if (!roomId || !ws.isConnected) {
      return;
    }

    const unsubscribe = dispatch(addCollabActionsListeners(ws, roomId));

    return () => {
      unsubscribe({ cancelActive: true });
    };
  }, [ws, roomId, dispatch]);

  useEffect(() => {
    if (ws.isConnected) {
      addNotification({
        title: 'Live collaboration',
        description: 'You are connected',
        type: 'success',
      });
    }
  }, [ws.isConnected, addNotification]);

  useEffect(() => {
    if (ws.isConnected || ws.isConnecting || roomId) {
      return;
    }

    const storedCanvasState = storage.get<AppState>(LOCAL_STORAGE_KEY);

    if (storedCanvasState) {
      dispatch(canvasActions.set(storedCanvasState.page));
    }
  }, [ws, roomId, dispatch]);

  useEffect(() => {
    const storedLibrary = storage.get<Library>(LOCAL_STORAGE_LIBRARY_KEY);

    if (storedLibrary) {
      dispatch(libraryActions.set(storedLibrary));
    }
  }, [dispatch]);

  return (
    <Styled.AppWrapper
      ref={appWrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Panels selectedNodeIds={selectedNodeIds} />
      <Suspense fallback={<Loader fullScreen>Loading Assets...</Loader>}>
        <ContextMenu.Root
          menuType={menuType}
          onContextMenuOpen={handleContextMenuOpen}
        >
          <ContextMenu.Trigger>
            <DrawingCanvas
              ref={stageRef}
              size={windowSize}
              onNodesSelect={setSelectedNodeIds}
            />
          </ContextMenu.Trigger>
        </ContextMenu.Root>
      </Suspense>
    </Styled.AppWrapper>
  );
};

export default App;

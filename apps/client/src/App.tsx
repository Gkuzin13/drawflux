import { useEffect } from 'react';
import {
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_LIBRARY_KEY,
  PAGE_URL_SEARCH_PARAM_KEY,
} from '@/constants/app';
import { useAppDispatch } from '@/stores/hooks';
import { canvasActions } from '@/services/canvas/slice';
import { storage } from '@/utils/storage';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import { useWebSocket } from './contexts/websocket';
import { libraryActions } from '@/services/library/slice';
import {
  addCollabActionsListeners,
  subscribeToIncomingCollabMessages,
} from './services/collaboration/listeners';
import useParam from './hooks/useParam/useParam';
import api from './services/api';
import { useNotifications } from './contexts/notifications';
import type { Library, AppState } from '@/constants/app';

const App = () => {
  const roomId = useParam(PAGE_URL_SEARCH_PARAM_KEY);

  const ws = useWebSocket();
  const { addNotification } = useNotifications();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!roomId) return;

    const [request, abortController] = api.getPage(roomId);

    request
      .then(({ page }) => {
        dispatch(canvasActions.setNodes(page.nodes, { broadcast: false }));
        addNotification({
          title: 'Live collaboration',
          description: 'You are connected',
          type: 'success',
        });
      })
      .catch(() => {
        addNotification({
          title: 'Live collaboration',
          description: 'Disconnected',
          type: 'info',
        });
      });

    return () => {
      if (abortController.signal) {
        abortController.abort();
      }
    };
  }, [roomId, dispatch, addNotification]);

  useEffect(() => {
    if (!ws.isConnected || !roomId) {
      return;
    }

    const subscribers = subscribeToIncomingCollabMessages(ws, dispatch);
    const unsubscribe = dispatch(addCollabActionsListeners(ws, roomId));

    return () => {
      subscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribe({ cancelActive: true });
    };
  }, [ws, roomId, dispatch]);

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

  return <MainLayout />;
};

export default App;

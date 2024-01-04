import { useEffect } from 'react';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_LIBRARY_KEY } from '@/constants/app';
import { useAppDispatch } from '@/stores/hooks';
import { canvasActions } from '@/services/canvas/slice';
import { storage } from '@/utils/storage';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import { useWebSocket } from './contexts/websocket';
import { libraryActions } from '@/services/library/slice';
import useParam from './hooks/useParam/useParam';
import useCollabRoom from './hooks/useCollabRoom';
import { CONSTANTS } from 'shared';
import type { Library, AppState } from '@/constants/app';

const App = () => {
  const roomId = useParam(CONSTANTS.COLLAB_ROOM_URL_PARAM);
  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  useCollabRoom(ws, roomId);

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

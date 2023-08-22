import { useLayoutEffect } from 'react';
import {
  type AppState,
  LOCAL_STORAGE_KEY,
  appState,
  PAGE_URL_SEARCH_PARAM_KEY,
} from '@/constants/app';
import { useAppDispatch, useAppStore } from '@/stores/hooks';
import { canvasActions } from '@/stores/slices/canvas';
import { storage } from '@/utils/storage';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import { useWebSocket } from './contexts/websocket';
import useWSMessage from './hooks/useWSMessage';
import { historyActions } from './stores/reducers/history';
import { collaborationActions } from './stores/slices/collaboration';
import useUrlSearchParams from './hooks/useUrlSearchParams/useUrlSearchParams';

const App = () => {
  const params = useUrlSearchParams();
  const ws = useWebSocket();

  const store = useAppStore();

  const dispatch = useAppDispatch();

  useWSMessage(ws.connection, (message) => {
    const { type, data } = message;

    switch (type) {
      case 'user-joined': {
        dispatch(collaborationActions.addUser(data));
        break;
      }
      case 'user-change': {
        dispatch(collaborationActions.updateUser(data));
        break;
      }
      case 'nodes-set': {
        dispatch(canvasActions.setNodes(data));
        break;
      }
      case 'nodes-add': {
        dispatch(canvasActions.addNodes(data));
        break;
      }
      case 'draft-end': {
        dispatch(canvasActions.addNodes([data]));
        break;
      }
      case 'nodes-update': {
        dispatch(canvasActions.updateNodes(data));
        break;
      }
      case 'nodes-delete': {
        dispatch(canvasActions.deleteNodes(data));
        break;
      }
      case 'nodes-move-to-start': {
        dispatch(canvasActions.moveNodesToStart(data));
        break;
      }
      case 'nodes-move-to-end': {
        dispatch(canvasActions.moveNodesToEnd(data));
        break;
      }
      case 'nodes-move-forward': {
        dispatch(canvasActions.moveNodesForward(data));
        break;
      }
      case 'nodes-move-backward': {
        dispatch(canvasActions.moveNodesBackward(data));
        break;
      }
      case 'draft-text-update': {
        const textNode = store
          .getState()
          .canvas.present.nodes.find((node) => node.nodeProps.id === data.id);

        if (textNode) {
          dispatch(
            canvasActions.updateNodes([{ ...textNode, text: data.text }]),
          );
        }
        break;
      }
      case 'history-change': {
        const action = historyActions[data.action];
        dispatch(action());
      }
    }
  });

  useLayoutEffect(() => {
    const pageId = params[PAGE_URL_SEARCH_PARAM_KEY];

    if (ws.isConnected || pageId) {
      return;
    }

    const state = storage.get<AppState>(LOCAL_STORAGE_KEY);

    if (state) {
      try {
        appState.parse(state);
      } catch (error) {
        return;
      }

      dispatch(canvasActions.set(state.page));
    }
  }, [ws, params, dispatch]);

  return <MainLayout />;
};

export default App;

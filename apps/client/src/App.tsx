import { useEffect } from 'react';
import { type AppState, LOCAL_STORAGE_KEY, appState } from '@/constants/app';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { storage } from '@/utils/storage';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import { useWebSocket } from './contexts/websocket';
import useWindowSize from './hooks/useWindowSize/useWindowSize';
import useWSMessage from './hooks/useWSMessage';
import { historyActions } from './stores/reducers/history';
import { collaborationActions } from './stores/slices/collaboration';

const App = () => {
  const { nodes } = useAppSelector(selectCanvas);
  const windowSize = useWindowSize();

  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  useWSMessage(ws?.connection, (message) => {
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
        const textNode = nodes.find((node) => node.nodeProps.id === data.id);

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

  useEffect(() => {
    if (ws?.pageId) {
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
  }, [ws?.pageId, dispatch]);

  return <MainLayout viewportSize={windowSize} />;
};

export default App;

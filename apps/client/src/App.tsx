import { useEffect } from 'react';
import { LOCAL_STORAGE, PageState, type PageStateType } from '@/constants/app';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { storage } from '@/utils/storage';
import Loader from './components/core/Loader/Loader';
import MainContainer from './components/MainContainer/MainContainer';
import { useWebSocket } from './contexts/websocket';
import useWindowSize from './hooks/useWindowSize/useWindowSize';
import useWSMessage from './hooks/useWSMessage';
import { historyActions } from './stores/reducers/history';
import { shareActions } from './stores/slices/share';

const App = () => {
  const { nodes } = useAppSelector(selectCanvas);
  const windowSize = useWindowSize();
  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  useWSMessage(
    {
      connection: ws?.connection,
      isConnected: ws?.isConnected,
      onMessage: (message) => {
        const { type, data } = message;

        switch (type) {
          case 'room-joined': {
            dispatch(
              shareActions.init({ userId: data.userId, users: data.users }),
            );
            dispatch(canvasActions.setNodes(data.nodes));
            break;
          }
          case 'nodes-set': {
            dispatch(canvasActions.setNodes(data.nodes));
            break;
          }
          case 'nodes-add': {
            dispatch(canvasActions.addNodes(data.nodes));
            break;
          }
          case 'nodes-update': {
            dispatch(canvasActions.updateNodes(data.nodes));
            break;
          }
          case 'nodes-delete': {
            dispatch(canvasActions.deleteNodes(data.nodesIds));
            break;
          }
          case 'nodes-duplicate': {
            dispatch(canvasActions.duplicateNodes(data.nodesIds));
            break;
          }
          case 'nodes-move-to-start': {
            dispatch(canvasActions.moveNodesToStart(data.nodesIds));
            break;
          }
          case 'nodes-move-to-end': {
            dispatch(canvasActions.moveNodesToEnd(data.nodesIds));
            break;
          }
          case 'nodes-move-forward': {
            dispatch(canvasActions.moveNodesForward(data.nodesIds));
            break;
          }
          case 'nodes-move-backward': {
            dispatch(canvasActions.moveNodesBackward(data.nodesIds));
            break;
          }
          case 'draft-text-update': {
            const textNode = nodes.find(
              (node) => node.nodeProps.id === data.id,
            );

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
      },
    },
    [dispatch],
  );

  useEffect(() => {
    if (ws?.pageId) {
      return;
    }

    const stateFromStorage = storage.get<PageStateType>(LOCAL_STORAGE.KEY);

    if (stateFromStorage) {
      try {
        PageState.parse(stateFromStorage);
      } catch (error) {
        return;
      }

      dispatch(canvasActions.set(stateFromStorage.page));
    }
  }, [ws, dispatch]);

  if (ws?.isConnecting) {
    return <Loader fullScreen={true}>Loading</Loader>;
  }

  return (
    <MainContainer isPageShared={!!ws?.pageId} viewportSize={windowSize} />
  );
};

export default App;

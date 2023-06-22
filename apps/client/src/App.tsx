import { useEffect, useState } from 'react';
import type { WSMessage } from 'shared';
import {
  LOCAL_STORAGE,
  PAGE_URL_SEARCH_PARAM_KEY,
  PageState,
  type PageStateType,
} from '@/constants/app';
import { useAppDispatch } from '@/stores/hooks';
import { canvasActions } from '@/stores/slices/canvas';
import { storage } from '@/utils/storage';
import Loader from './components/core/Loader/Loader';
import MainContainer from './components/MainContainer/MainContainer';
import useWindowSize from './hooks/useWindowSize/useWindowSize';
import { shareActions } from './stores/slices/share';
import { uiActions } from './stores/slices/ui';
import { urlSearchParam } from './utils/url';
import { useWebSocket } from './webSocketContext';

const App = () => {
  const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const windowSize = useWindowSize();

  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      setLoading(true);

      ws.onopen = () => {
        setLoading(false);

        ws.onmessage = (event) => {
          const parsedMessage = JSON.parse(event.data) as WSMessage;

          switch (parsedMessage.type) {
            case 'room-joined': {
              const data =
                parsedMessage.data as WSMessage<'roomJoined'>['data'];

              dispatch(
                shareActions.connect({
                  userId: data.userId,
                  users: data.room.users,
                  isConnected: true,
                }),
              );
              dispatch(canvasActions.setNodes(data.room.nodes));
              break;
            }
            case 'user-joined': {
              const data =
                parsedMessage.data as WSMessage<'userJoined'>['data'];

              dispatch(shareActions.addUser(data.user));
              break;
            }
            case 'user-change': {
              const data =
                parsedMessage.data as WSMessage<'userChange'>['data'];
              dispatch(shareActions.updateUser(data.user));
              break;
            }
            case 'user-left': {
              const data = parsedMessage.data as WSMessage<'userLeft'>['data'];
              dispatch(shareActions.removeUser({ id: data.userId }));

              break;
            }
            case 'nodes-add': {
              const data =
                parsedMessage.data as WSMessage<'nodesAddUpdate'>['data'];
              dispatch(canvasActions.addNodes(data.nodes));
              break;
            }
            case 'nodes-update': {
              const data =
                parsedMessage.data as WSMessage<'nodesAddUpdate'>['data'];
              dispatch(canvasActions.updateNodes(data.nodes));
              break;
            }
            case 'nodes-delete': {
              const data =
                parsedMessage.data as WSMessage<'nodesDelete'>['data'];
              dispatch(canvasActions.deleteNodes(data.nodesIds));
              break;
            }
            default:
              break;
          }
        };
      };

      ws.onerror = () => {
        dispatch(
          uiActions.openDialog({
            title: 'Error',
            description: 'Error loading page',
          }),
        );
        setLoading(false);
      };
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
  }, [pageId, dispatch, ws]);

  if (loading) {
    return <Loader fullScreen={true}>Loading</Loader>;
  }

  return <MainContainer isPageShared={!!pageId} viewportSize={windowSize} />;
};

export default App;

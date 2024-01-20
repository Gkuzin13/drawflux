import { addAppListener } from '@/stores/middlewares/listenerMiddleware';
import { isAnyOf } from '@reduxjs/toolkit';
import { collaborationActions } from './slice';
import { canvasActions } from '../canvas/slice';
import { storage } from '@/utils/storage';
import api from '@/services/api';
import { LOCAL_STORAGE_COLLAB_KEY } from '@/constants/app';
import type { WebSocketContextValue } from '@/contexts/websocket';
import type { AppDispatch } from '@/stores/store';
import type { ActionMeta } from '../canvas/slice';
import type { StoredCollabState } from '@/constants/app';

/**
 * subscribe to canvas/collaboration actions and send corresponding messages
 */
export const addCollabActionsListeners = (
  ws: WebSocketContextValue,
  roomId: string,
) => {
  const matcher = isAnyOf(
    collaborationActions.updateUser,
    canvasActions.addNodes,
    canvasActions.updateNodes,
    canvasActions.deleteNodes,
    canvasActions.moveNodesBackward,
    canvasActions.moveNodesForward,
    canvasActions.moveNodesToEnd,
    canvasActions.moveNodesToStart,
    canvasActions.setNodes,
  );
  
  return addAppListener({
    matcher,
    effect: (action, listenerApi) => {
      if (action.meta?.receivedFromWS || action.meta?.broadcast === false) {
        return;
      }

      const state = listenerApi.getState().canvas.present;

      if (!collaborationActions.updateUser.match(action)) {
        api.updatePage(roomId, { nodes: state.nodes });
      }

      switch (action.type) {
        case 'collaboration/updateUser':
          ws.send({ type: 'user-change', data: action.payload });
          break;
        case 'canvas/addNodes':
          ws.send({ type: 'nodes-add', data: action.payload });
          break;
        case 'canvas/updateNodes':
          ws.send({ type: 'nodes-update', data: action.payload });
          break;
        case 'canvas/deleteNodes':
          ws.send({ type: 'nodes-delete', data: action.payload });
          break;
        case 'canvas/moveNodesBackward':
          ws.send({ type: 'nodes-move-backward', data: action.payload });
          break;
        case 'canvas/moveNodesForward':
          ws.send({ type: 'nodes-move-forward', data: action.payload });
          break;
        case 'canvas/moveNodesToEnd':
          ws.send({ type: 'nodes-move-to-end', data: action.payload });
          break;
        case 'canvas/moveNodesToStart':
          ws.send({ type: 'nodes-move-to-start', data: action.payload });
          break;
        case 'canvas/setNodes':
          ws.send({ type: 'nodes-set', data: action.payload });
          break;
      }
    },
  });
};

/**
 * subscribe to incoming ws messages and dispatch corresponding actions
 */
export const subscribeToIncomingCollabMessages = (
  ws: WebSocketContextValue,
  dispatch: AppDispatch,
) => {
  const actionMeta: ActionMeta = { receivedFromWS: true };

  const subscribers = [
    ws.subscribe('room-joined', (data) => {
      const collabState = storage.get<StoredCollabState>(
        LOCAL_STORAGE_COLLAB_KEY,
      );

      if (collabState) {
        const thisUser = { ...data.thisUser, ...collabState.user };

        ws.send({ type: 'user-change', data: thisUser });

        dispatch(collaborationActions.init({ ...data, thisUser }));
      } else {
        dispatch(collaborationActions.init(data));
      }
    }),
    ws.subscribe('user-joined', (data) =>
      dispatch(collaborationActions.addUser(data)),
    ),
    ws.subscribe('user-change', (data) =>
      dispatch(collaborationActions.updateUser(data, actionMeta)),
    ),
    ws.subscribe('user-left', (data) =>
      dispatch(collaborationActions.removeUser(data)),
    ),
    ws.subscribe('nodes-set', (data) =>
      dispatch(canvasActions.setNodes(data, actionMeta)),
    ),
    ws.subscribe('nodes-add', (data) =>
      dispatch(canvasActions.addNodes(data, actionMeta)),
    ),
    ws.subscribe('nodes-update', (data) =>
      dispatch(canvasActions.updateNodes(data, actionMeta)),
    ),
    ws.subscribe('nodes-delete', (data) =>
      dispatch(canvasActions.deleteNodes(data, actionMeta)),
    ),
    ws.subscribe('nodes-move-to-start', (data) =>
      dispatch(canvasActions.moveNodesToStart(data, actionMeta)),
    ),
    ws.subscribe('nodes-move-to-end', (data) =>
      dispatch(canvasActions.moveNodesToEnd(data, actionMeta)),
    ),
    ws.subscribe('nodes-move-forward', (data) =>
      dispatch(canvasActions.moveNodesForward(data, actionMeta)),
    ),
    ws.subscribe('nodes-move-backward', (data) =>
      dispatch(canvasActions.moveNodesBackward(data, actionMeta)),
    ),
  ] as const;

  return subscribers;
};

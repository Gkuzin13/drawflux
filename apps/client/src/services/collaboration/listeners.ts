import { addAppListener } from '@/stores/middlewares/listenerMiddleware';
import { isAnyOf } from '@reduxjs/toolkit';
import { collaborationActions } from './slice';
import { canvasActions } from '../canvas/slice';
import api from '@/services/api';
import type { WebSocketContextValue } from '@/contexts/websocket';
import type { AppDispatch } from '@/stores/store';
import type { ActionMeta } from '../canvas/slice';

/**
 * subscribe to collaborrative actions and send messages
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
    canvasActions.pasteNodes,
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
        case 'canvas/pasteNodes': {
          const pasteNodes = state.nodes.filter(
            (node) => node.nodeProps.id in state.selectedNodesIds,
          );

          ws.send({ type: 'nodes-add', data: pasteNodes });
          break;
        }
        case 'collaboration/updateUser':
          ws.send({ type: 'user-change', data: action.payload });
          break;
      }
    },
  });
};

/**
 * subscribe to incoming ws messages and dispatch actions
 */
export const subscribeToIncomingCollabMessages = (
  ws: WebSocketContextValue,
  dispatch: AppDispatch,
) => {
  const actionMeta: ActionMeta = { receivedFromWS: true };

  const subscribers = [
    ws.subscribe('room-joined', (data) => {
      dispatch(collaborationActions.init(data));
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

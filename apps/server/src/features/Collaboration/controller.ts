import type { IncomingMessage } from 'http';
import { type WSMessage, WSMessageUtil } from 'shared';
import type { RawData } from 'ws';
import { type PatchedWebSocket } from '@/services/websocket';
import { findPage, getUnusedUserColor } from './helpers';
import { CollabRoom, CollabUser } from './models';

const rooms = new Map<string, InstanceType<typeof CollabRoom>>();

export async function initCollabConnection(
  ws: PatchedWebSocket,
  req: IncomingMessage,
) {
  const url = req.url as string;
  const pageId = new URL(url, req.headers.origin).searchParams.get('id');
  const page = pageId ? await findPage(pageId) : null;

  if (!page || !pageId) {
    return ws.close(1011, 'Page not found');
  }

  const room = rooms.get(pageId) || new CollabRoom(pageId);

  if (room.hasReachedMaxUsers()) {
    return ws.close(
      1011,
      'Sorry, the collaborative drawing session has reached its maximum number of users.',
    );
  }

  const userColor = getUnusedUserColor(room.users);
  const user = new CollabUser('New User', userColor, ws);

  room.addUser(user);
  rooms.set(room.id, room);

  const roomJoinedMessage = WSMessageUtil.serialize({
    type: 'room-joined',
    data: { users: room.users, userId: user.id, nodes: page.nodes },
  } as WSMessage);

  roomJoinedMessage && ws.send(roomJoinedMessage);

  if (room.hasMultipleUsers()) {
    const userJoinedMessage = WSMessageUtil.serialize({
      type: 'user-joined',
      data: { user },
    } as WSMessage);

    userJoinedMessage && room.broadcast(user.id, userJoinedMessage);
  }

  ws.on('message', (rawMessage) => onMessage(rawMessage, user, room));
  ws.on('close', () => onClose(ws, user, room));
}

export function onClose(
  ws: PatchedWebSocket,
  user: CollabUser,
  room: CollabRoom,
) {
  leaveRoom(user, room);
  ws.terminate();
}

export function onMessage(
  rawMessage: RawData,
  user: CollabUser,
  room: CollabRoom,
) {
  const message = rawMessage.toString();
  const deserializedMessage = WSMessageUtil.deserialize(message);

  if (!deserializedMessage) {
    return;
  }

  if (deserializedMessage.type === 'user-change') {
    room.updateUser(deserializedMessage.data.user);
  }

  if (room.hasMultipleUsers()) {
    room.broadcast(user.id, message);
  }
}

export function leaveRoom(user: CollabUser, room: CollabRoom) {
  room.removeUser(user.id);

  if (room.isEmpty()) {
    return rooms.delete(room.id);
  }

  const message = WSMessageUtil.serialize({
    type: 'user-left',
    data: { id: user.id },
  } as WSMessage);

  message && room.broadcast(user.id, message);
}

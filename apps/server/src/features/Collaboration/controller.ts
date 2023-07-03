import type { IncomingMessage } from 'http';
import { type WSMessage, WSMessageUtil } from 'shared';
import type { RawData, WebSocket } from 'ws';
import { broadcast, findPage, getUnusedUserColor } from './helpers';
import { CollabRoom, CollabUser } from './models';

const rooms = new Map<string, InstanceType<typeof CollabRoom>>();

export async function initWSEvents(ws: WebSocket, req: IncomingMessage) {
  const connection = await handleConnection(ws, req);

  if (connection) {
    const { room, user } = connection;

    rooms.set(room.id, room);

    ws.on('error', handleError);
    ws.on('close', () => handleClose(ws, user, room));
    ws.on('message', (rawMessage) => handleMessage(rawMessage, user, room));
  }
}

export async function handleConnection(ws: WebSocket, req: IncomingMessage) {
  const url = req.url as string;
  const pageId = new URL(url, req.headers.origin).searchParams.get('id');
  const page = pageId ? await findPage(pageId) : null;

  if (!page || !pageId) {
    ws.close(1011, 'Page not found');
    return;
  }

  const room = rooms.get(pageId) || new CollabRoom(pageId);

  if (room.hasReachedMaxUsers()) {
    ws.close(
      1011,
      'Sorry, the collaborative drawing session has reached its maximum number of users.',
    );
    return;
  }

  const userColor = getUnusedUserColor(room.users);
  const user = new CollabUser('New User', userColor, ws);

  room.addUser(user);

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

    userJoinedMessage && broadcast(room, user.id, userJoinedMessage);
  }

  return { room, user };
}

export function handleClose(ws: WebSocket, user: CollabUser, room: CollabRoom) {
  room.removeUser(user.id);

  if (room.isEmpty()) {
    rooms.delete(room.id);
    ws.terminate();
    return;
  }

  const message = WSMessageUtil.serialize({
    type: 'user-left',
    data: { id: user.id },
  } as WSMessage);

  message && broadcast(room, user.id, message);
}

export function handleMessage(
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
    broadcast(room, user.id, message);
  }
}

export function handleError(ws: WebSocket, error: Error) {
  console.error(ws.url, error);
}

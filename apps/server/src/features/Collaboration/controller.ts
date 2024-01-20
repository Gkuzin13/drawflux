import { CollabRoom, CollabUser } from './models';
import { findPage } from './helpers';
import { WSMessageUtil } from 'shared';
import type { IncomingMessage } from 'http';
import type { WSMessage } from 'shared';
import type { RawData } from 'ws';
import type { PatchedWebSocket } from '@/services/websocket';

const rooms = new Map<string, InstanceType<typeof CollabRoom>>();

export async function initCollabConnection(
  ws: PatchedWebSocket,
  req: IncomingMessage,
) {
  const url = req.url as string;
  const pageId = new URL(url, req.headers.origin).searchParams.get('id');
  const page = pageId ? await findPage(pageId) : null;

  if (!page || !pageId) {
    return ws.close(1011, 'Room not found');
  }

  const room = rooms.get(pageId) || new CollabRoom(pageId);

  if (room.hasReachedMaxUsers()) {
    return ws.close(
      1011,
      'Sorry, the collaborative drawing session has reached its maximum number of users.',
    );
  }

  const user = new CollabUser(ws);

  room.addUser(user);
  rooms.set(room.id, room);

  const collaborators = room.getCollaborators(user.id);

  const roomJoinedMessage = WSMessageUtil.serialize({
    type: 'room-joined',
    data: { collaborators, thisUser: user },
  } as WSMessage);

  roomJoinedMessage && ws.send(roomJoinedMessage);

  if (room.hasMultipleUsers()) {
    const userJoinedMessage = WSMessageUtil.serialize({
      type: 'user-joined',
      data: user,
    } as WSMessage);

    userJoinedMessage && room.broadcast(user.id, userJoinedMessage);
  }

  ws.on('message', (rawMessage) => receiveMessage(rawMessage, user, room));
  ws.on('close', () => leaveRoom(user, room));
  ws.on('error', (error) => console.error(error.message));
}

export function receiveMessage(
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
    room.updateUser(deserializedMessage.data);
  }

  room.broadcast(user.id, message);
}

export function leaveRoom(user: CollabUser, room: CollabRoom) {
  room.removeUser(user.id);

  const message = WSMessageUtil.serialize({
    type: 'user-left',
    data: { id: user.id },
  } as WSMessage);

  message && room.broadcast(user.id, message);

  if (room.isEmpty()) {
    return rooms.delete(room.id);
  }
}

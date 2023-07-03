import type { IncomingMessage } from 'http';
import { type WSMessage, WSMessageUtil } from 'shared';
import type { WebSocket } from 'ws';
import { COLORS, MAX_USERS } from './constants';
import { broadcast, findPage } from './helpers';
import { CollabRoom, CollabUser } from './models';

const rooms = new Map<string, InstanceType<typeof CollabRoom>>();

export async function handleWSConnection(ws: WebSocket, req: IncomingMessage) {
  const url = req.url as string;
  const pageId = new URL(url, req.headers.origin).searchParams.get('id');
  const page = pageId ? await findPage(pageId) : null;

  if (!page || !pageId) {
    ws.close(1011, 'Page not found');
    return;
  }

  const room = rooms.get(pageId);

  const usedColors = new Set(room ? room.users.map((user) => user.color) : []);
  const userColor = COLORS.find((color) => !usedColors.has(color));
  const user = new CollabUser('New User', userColor || COLORS[0], ws);

  if (room) {
    if (room.userCount() >= MAX_USERS) {
      ws.close(
        1011,
        'Sorry, the collaborative drawing session has reached its maximum number of users.',
      );
      return;
    }

    room.addUser(user);

    const roomJoinedMessage: WSMessage = {
      type: 'room-joined',
      data: { users: room.users, userId: user.id, nodes: page.nodes },
    };

    const userJoinedMessage: WSMessage = {
      type: 'user-joined',
      data: { user },
    };

    const serializedRoomJoinedMessage =
      WSMessageUtil.serialize(roomJoinedMessage);
    const serializedUserJoinedMessage =
      WSMessageUtil.serialize(userJoinedMessage);

    if (serializedRoomJoinedMessage && serializedUserJoinedMessage) {
      ws.send(serializedRoomJoinedMessage);
      broadcast(room, user.id, serializedUserJoinedMessage);
    }
  } else {
    const newRoom = new CollabRoom(pageId, user);

    const roomJoinedMessage: WSMessage = {
      type: 'room-joined',
      data: { users: newRoom.users, userId: user.id, nodes: page.nodes },
    };

    const message = WSMessageUtil.serialize(roomJoinedMessage);

    if (message) {
      ws.send(message);
      rooms.set(pageId, newRoom);
    }
  }

  ws.on('error', console.error);

  ws.on('close', () => {
    const roomToUpdate = rooms.get(pageId);

    if (!roomToUpdate) {
      return;
    }

    roomToUpdate.removeUser(user.id);

    rooms.set(pageId, roomToUpdate);

    const userLeftMessage: WSMessage = {
      type: 'user-left',
      data: { id: user.id },
    };

    const message = WSMessageUtil.serialize(userLeftMessage);

    if (message) {
      broadcast(roomToUpdate, user.id, message);
    }

    if (roomToUpdate.users.length <= 0) {
      ws.terminate();
      rooms.delete(pageId);
    }
  });

  ws.on('message', (rawMessage) => {
    const message = rawMessage.toString();
    const deserializedMessage = WSMessageUtil.deserialize(message);
    const roomToUpdate = rooms.get(pageId);

    if (!deserializedMessage || !roomToUpdate) {
      return;
    }

    switch (deserializedMessage.type) {
      case 'user-change': {
        roomToUpdate.updateUser(deserializedMessage.data.user);
        rooms.set(pageId, roomToUpdate);
        broadcast(roomToUpdate, user.id, message);

        break;
      }
      default: {
        broadcast(roomToUpdate, user.id, message);
      }
    }
  });
}

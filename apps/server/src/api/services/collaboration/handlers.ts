import type { IncomingMessage } from 'http';
import type internal from 'stream';
import { type WSMessage, WSMessageUtil, type User } from 'shared';
import { WebSocketServer } from 'ws';
import queries from '../../queries';
import { CollabRoom, CollabUser } from './models';

const MAX_USERS = 4;

const colorNames = [
  'teal600',
  'light-blue600',
  'indigo600',
  'gray600',
] as User['color'][];

const wss = new WebSocketServer({ noServer: true });
const rooms = new Map<string, InstanceType<typeof CollabRoom>>();

export function openNewWSConnection(
  req: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer,
) {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
}

function broadcast(room: CollabRoom, broadcasterId: string, message: string) {
  room.users.forEach((user) => {
    if (user.id !== broadcasterId) {
      user.getWS().send(message);
    }
  });
}

async function findPage(id: string) {
  try {
    return (await queries.getPage(id)).page;
  } catch (error) {
    return null;
  }
}

wss.on('connection', async (ws, req) => {
  if (!req.url || !req.headers.origin) {
    ws.close(1011, 'Bad request');
    return;
  }

  const pageId = new URL(req.url, req.headers.origin).searchParams.get('id');
  const page = pageId ? await findPage(pageId) : null;

  if (!page || !pageId) {
    ws.close(1011, 'Page not found');
    return;
  }

  const room = rooms.get(pageId);

  const usedColors = new Set(room?.users.map((user) => user.color) || []);
  const userColor = colorNames.find((color) => !usedColors.has(color));
  const user = new CollabUser('New User', userColor || colorNames[0], ws);

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
        broadcast(roomToUpdate, user.id, message);

        roomToUpdate.updateUser(deserializedMessage.data.user);
        rooms.set(pageId, roomToUpdate);
        break;
      }
      default: {
        broadcast(roomToUpdate, user.id, message);
      }
    }
  });
});

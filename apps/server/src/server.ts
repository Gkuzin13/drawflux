import { randomUUID } from 'node:crypto';
import { URLSearchParams } from 'node:url';
import type {
  Room as CollabRoom,
  User as CollabUser,
  Point,
  WSMessage,
} from 'shared';
import { WSMessageUtil } from 'shared';
import { WebSocketServer, type WebSocket } from 'ws';
import app from './app';
import * as db from './db/index';
import jobs from './db/jobs';
import { queries } from './db/queries/index';
import type { GetPageReturn, GetPageValues } from './db/queries/types';

(async () => {
  const client = await db.getClient();

  try {
    await db.query(queries.createPageTable);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})();

jobs.deleteExpiredPages.start();

const port = process.env.PORT || 7456;

const httpServer = app.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${port}`);
});

const wss = new WebSocketServer({ noServer: true });

const rooms = new Map<string, InstanceType<typeof Room>>();

const colorsSet: CollabUser['color'][] = [
  'green600',
  'pink600',
  'blue600',
  'deep-orange600',
];

class Room implements CollabRoom {
  id;
  users;

  constructor(id: string, user: InstanceType<typeof User>) {
    this.id = id;
    this.users = [user];
  }

  addUser(user: InstanceType<typeof User>) {
    this.users.push(user);

    return this;
  }

  updateUser(user: CollabUser) {
    const userIndex = this.users.findIndex((u) => u.id === user?.id);

    if (userIndex <= -1) {
      return;
    }

    if (user.name) {
      this.users[userIndex].name = user.name;
    }
    if (user.color) {
      this.users[userIndex].color = user.color;
    }
    if (user.position) {
      this.users[userIndex].position = user.position;
    }
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

class User implements CollabUser {
  id;
  position: Point;
  name;
  color;
  #ws: WebSocket;

  constructor(name: string, color: CollabUser['color'], ws: WebSocket) {
    this.id = randomUUID();
    this.position = [0, 0];
    this.name = name;
    this.color = color;
    this.#ws = ws;
  }

  getWS() {
    return this.#ws;
  }
}

async function getPage(id: string) {
  const client = await db.getClient();

  try {
    const { rows } = await db.query<GetPageReturn, GetPageValues>(
      queries.getPage,
      [id],
    );

    return rows[0] ?? null;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    client.release();
  }
}

httpServer.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

function broadcast(roomId: string, broadcasterId: string, message: string) {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.users.forEach((user) => {
    if (user.id !== broadcasterId) {
      user.getWS().send(message);
    }
  });
}

wss.on('connection', async (ws, req) => {
  const roomId = new URLSearchParams(req.url).get('id');

  if (!roomId) {
    ws.terminate();
    return;
  }

  const room = rooms.get(roomId);
  const userName = room ? `User ${room.users?.length + 1}` : 'User';
  const usedColors = room?.users.map((user) => user.color) || [];
  const userColor =
    colorsSet.find((color) => !usedColors.includes(color)) || colorsSet[0];
  const user = new User(userName, userColor, ws);

  if (room) {
    const updatedRoom = room.addUser(user);
    const page = roomId ? await getPage(roomId) : null;

    if (!page) {
      ws.terminate();
      return;
    }

    const roomJoinedMessage: WSMessage = {
      type: 'room-joined',
      data: { users: updatedRoom.users, userId: user.id, nodes: page.nodes },
    };

    const userJoinedMessage: WSMessage = {
      type: 'user-joined',
      data: { user },
    };

    const serializedRoomJoinedMessage =
      WSMessageUtil.serialize(roomJoinedMessage);
    const serializedUserJoinedMessage =
      WSMessageUtil.serialize(userJoinedMessage);

    if (!serializedRoomJoinedMessage || !serializedUserJoinedMessage) {
      return;
    }

    ws.send(serializedRoomJoinedMessage);

    broadcast(roomId, user.id, serializedUserJoinedMessage);

    rooms.set(roomId, updatedRoom);
  } else {
    const page = roomId ? await getPage(roomId) : null;

    if (!page) {
      ws.terminate();
      return;
    }

    const newRoom = new Room(roomId, user);

    const roomJoinedMessage: WSMessage = {
      type: 'room-joined',
      data: { users: newRoom.users, userId: user.id, nodes: page.nodes },
    };

    const message = WSMessageUtil.serialize(roomJoinedMessage);

    if (message) {
      ws.send(message);
      rooms.set(roomId, newRoom);
    }
  }

  ws.on('error', console.error);

  ws.on('close', () => {
    const roomToUpdate = rooms.get(roomId);

    if (!roomToUpdate) {
      return;
    }

    roomToUpdate.removeUser(user.id);

    rooms.set(roomId, roomToUpdate);

    const userLeftMessage: WSMessage = {
      type: 'user-left',
      data: { id: user.id },
    };

    const message = WSMessageUtil.serialize(userLeftMessage);

    if (!message) {
      return;
    }

    broadcast(roomId, user.id, message);

    if (roomToUpdate.users.length <= 0) {
      ws.terminate();
      rooms.delete(roomId);
    }
  });

  ws.on('message', (rawMessage) => {
    const message = rawMessage.toString();
    const deserializedMessage = WSMessageUtil.deserialize(message);
    const roomToUpdate = rooms.get(roomId);

    if (!deserializedMessage || !roomToUpdate) {
      return;
    }

    switch (deserializedMessage.type) {
      case 'user-change': {
        broadcast(roomId, user.id, message);

        roomToUpdate.updateUser(deserializedMessage.data.user);
        rooms.set(roomId, roomToUpdate);
        break;
      }
      default: {
        broadcast(roomId, user.id, message);
      }
    }
  });
});

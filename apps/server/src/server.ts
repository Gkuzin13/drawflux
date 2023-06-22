import { randomUUID } from 'node:crypto';
import { URLSearchParams } from 'node:url';
import type { QueryResult } from 'pg';
import type {
  CollabRoom,
  CollabUser,
  NodeObject,
  Point,
  WSMessage,
} from 'shared';
import { WebSocketServer, type WebSocket, type RawData } from 'ws';
import app from './app';
import * as db from './db/index';
import jobs from './db/jobs';
import { queries } from './db/queries/index';
import type { GetPageArgs, PageRowObject } from './db/queries/types';

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
  nodes: NodeObject[];

  constructor(
    id: string,
    user: InstanceType<typeof User>,
    nodes: NodeObject[],
  ) {
    this.id = id;
    this.nodes = nodes;
    this.users = [user];
  }

  addNodes(nodes: NodeObject[]) {
    this.nodes.push(...nodes);
  }

  updateNodes(nodes: NodeObject[]) {
    const nodesMap = new Map<string, NodeObject>(
      nodes.map((node) => [node.nodeProps.id, node]),
    );

    this.nodes = this.nodes.map((node) => {
      if (nodesMap.has(node.nodeProps.id)) {
        return nodesMap.get(node.nodeProps.id) as NodeObject;
      }
      return node;
    });
  }

  removeNodes(nodesIds: string[]) {
    const ids = new Set<string>(nodesIds);

    this.nodes = this.nodes.filter((node) => !ids.has(node.nodeProps.id));
  }

  addUser(user: InstanceType<typeof User>) {
    this.users.push(user);

    return this;
  }

  updateUser(user: WSMessage<'userChange'>['data']['user']) {
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

async function getPage(id: string): Promise<PageRowObject | null> {
  const client = await db.getClient();

  try {
    const { rows }: QueryResult = await db.query<GetPageArgs>(queries.getPage, [
      id,
    ]);

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

    const roomJoinedMessage: WSMessage<'roomJoined'> = {
      type: 'room-joined',
      data: { room: updatedRoom, userId: user.id },
    };

    const userJoinedMessage: WSMessage<'userJoined'> = {
      type: 'user-joined',
      data: { user },
    };

    ws.send(createJsonWSMessage(roomJoinedMessage));

    broadcast(roomId, user.id, createJsonWSMessage(userJoinedMessage));

    rooms.set(roomId, updatedRoom);
  } else {
    const page = roomId ? await getPage(roomId) : null;

    if (!page) {
      ws.terminate();
      return;
    }

    const newRoom = new Room(roomId, user, page.nodes);

    const roomJoinedMessage: WSMessage<'roomJoined'> = {
      type: 'room-joined',
      data: { room: newRoom, userId: user.id },
    };

    ws.send(createJsonWSMessage(roomJoinedMessage));

    rooms.set(roomId, newRoom);
  }

  ws.on('error', console.error);

  ws.on('close', () => {
    const roomToUpdate = rooms.get(roomId);

    if (!roomToUpdate) {
      return;
    }

    roomToUpdate.removeUser(user.id);

    rooms.set(roomId, roomToUpdate);

    const userLeftMessage: WSMessage<'userLeft'> = {
      type: 'user-left',
      data: { userId: user.id },
    };

    broadcast(roomId, user.id, createJsonWSMessage(userLeftMessage));

    if (roomToUpdate.users.length <= 0) {
      ws.terminate();
      rooms.delete(roomId);
    }
  });

  ws.on('message', (message) => {
    const parsedMessage = parseWSMessage(message);
    const roomToUpdate = rooms.get(roomId);

    if (!parsedMessage || !roomToUpdate) {
      return;
    }

    switch (parsedMessage.type) {
      case 'user-change': {
        const data = parsedMessage.data as WSMessage<'userChange'>['data'];

        const userChangeMessage: WSMessage<'userChange'> = {
          type: 'user-change',
          data,
        };

        broadcast(roomId, user.id, createJsonWSMessage(userChangeMessage));

        roomToUpdate.updateUser(data.user);
        rooms.set(roomId, roomToUpdate);

        break;
      }
      case 'nodes-add': {
        const data = parsedMessage.data as WSMessage<'nodesAddUpdate'>['data'];

        const nodesAddUpdateMessage: WSMessage<'nodesAddUpdate'> = {
          type: 'nodes-add',
          data,
        };

        broadcast(roomId, user.id, createJsonWSMessage(nodesAddUpdateMessage));

        roomToUpdate.addNodes(data.nodes);
        rooms.set(roomId, roomToUpdate);
        break;
      }
      case 'nodes-update': {
        const data = parsedMessage.data as WSMessage<'nodesAddUpdate'>['data'];

        const nodesUpdateMessage: WSMessage<'nodesAddUpdate'> = {
          type: 'nodes-update',
          data,
        };

        broadcast(roomId, user.id, createJsonWSMessage(nodesUpdateMessage));

        roomToUpdate.updateNodes(data.nodes);
        rooms.set(roomId, roomToUpdate);
        break;
      }
      case 'nodes-delete': {
        const data = parsedMessage.data as WSMessage<'nodesDelete'>['data'];

        const nodesUpdateMessage: WSMessage<'nodesDelete'> = {
          type: 'nodes-delete',
          data,
        };

        broadcast(roomId, user.id, createJsonWSMessage(nodesUpdateMessage));

        roomToUpdate.removeNodes(data.nodesIds);
        rooms.set(roomId, roomToUpdate);
        break;
      }
    }
  });
});

function parseWSMessage(data: RawData): WSMessage | null {
  try {
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(error);
    return null;
  }
}

function createJsonWSMessage(message: WSMessage): string {
  return JSON.stringify(message);
}

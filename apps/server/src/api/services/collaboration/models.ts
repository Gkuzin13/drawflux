import { randomUUID } from 'crypto';
import type { Point, Room, User } from 'shared';
import type WebSocket from 'ws';

export class CollabRoom implements Room {
  id;
  users;

  constructor(id: string, user: InstanceType<typeof CollabUser>) {
    this.id = id;
    this.users = [user];
  }

  addUser(user: InstanceType<typeof CollabUser>) {
    this.users.push(user);
    return this;
  }

  updateUser(user: User) {
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
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export class CollabUser implements User {
  id;
  position: Point;
  name;
  color;
  #ws: WebSocket;

  constructor(name: string, color: User['color'], ws: WebSocket) {
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

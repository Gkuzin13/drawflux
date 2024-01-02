import { randomUUID } from 'crypto';
import type { Room, User } from 'shared';
import WebSocket from 'ws';
import { MAX_USERS } from './constants';

export class CollabRoom implements Room {
  id;
  users: CollabUser[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addUser(user: InstanceType<typeof CollabUser>) {
    this.users.push(user);
  }

  updateUser(updatedUser: User) {
    const userIndex = this.users.findIndex((u) => u.id === updatedUser.id);

    if (userIndex <= -1) {
      return;
    }

    const userToUpdate = this.users[userIndex];
    userToUpdate.update(updatedUser);
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  getCollaborators(userId: string) {
    return this.users.filter((user) => user.id !== userId);
  }

  broadcast(broadcasterId: string, message: string) {
    this.users.forEach((user) => {
      const ws = user.getWS();

      if (user.id !== broadcasterId && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  hasReachedMaxUsers() {
    return this.users.length >= MAX_USERS;
  }

  hasMultipleUsers() {
    return this.users.length > 1;
  }

  isEmpty() {
    return this.users.length === 0;
  }
}

export class CollabUser implements User {
  id;
  name;
  color;
  #ws: WebSocket;

  constructor(name: string, color: User['color'], ws: WebSocket) {
    this.id = randomUUID();
    this.name = name;
    this.color = color;
    this.#ws = ws;
  }

  update(user: Pick<User, 'color' | 'name'>) {
    this.color = user.color;
    this.name = user.name;
  }

  getWS() {
    return this.#ws;
  }
}

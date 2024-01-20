import { randomUUID } from 'crypto';
import WebSocket from 'ws';
import {
  COLORS,
  DEFAULT_COLOR,
  DEFAULT_NAME,
  MAX_USERS,
  USER_NAMES,
} from './constants';
import type { Room, User } from 'shared';

export class CollabRoom implements Room {
  id;
  users: CollabUser[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addUser(user: InstanceType<typeof CollabUser>) {
    const color = this.#getUnusedUserColor();
    const name = this.#getUnusedUsername();

    user.update({ color, name });

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

  #getUnusedUserColor() {
    const usedColors = new Set(this.users.map(({ color }) => color));
    return COLORS.find((color) => !usedColors.has(color)) ?? DEFAULT_COLOR;
  }

  #getUnusedUsername() {
    const usedUserNames = new Set(this.users.map(({ name }) => name));
    return USER_NAMES.find((name) => !usedUserNames.has(name)) ?? DEFAULT_NAME;
  }
}

export class CollabUser implements User {
  id = randomUUID();
  name = DEFAULT_NAME;
  color = DEFAULT_COLOR;
  #ws;

  constructor(ws: WebSocket) {
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

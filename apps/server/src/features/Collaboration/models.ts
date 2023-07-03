import { randomUUID } from 'crypto';
import type { Point, Room, User } from 'shared';
import type WebSocket from 'ws';
import { MAX_USERS } from './constants';

export class CollabRoom implements Room {
  id;
  users: CollabUser[] = [];

  constructor(id: string) {
    this.id = id;
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

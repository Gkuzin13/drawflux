import { WSMessageUtil, type User, type WSMessage } from 'shared';
import WebSocket from 'ws';
import { MAX_USERS } from '../constants';
import { CollabRoom, CollabUser } from '../models';

vi.mock('ws');

const ws = vi.fn(
  () =>
    ({
      send: vi.fn(),
      readyState: WebSocket.OPEN,
    } as unknown as WebSocket),
);

describe('CollabRoom', () => {
  let room: CollabRoom;

  beforeEach(() => {
    room = new CollabRoom('room-1');
  });

  it('should init a room correctly', () => {
    expect(room.id).toBe('room-1');
    expect(room.users).toHaveLength(0);
  });

  it('should broadcast to all users except the broadcaster', () => {
    const user1 = new CollabUser('User-1', 'black', new ws());
    const user2 = new CollabUser('User-2', 'blue600', new ws());
    const user3 = new CollabUser('User-3', 'green600', new ws());

    room.addUser(user1);
    room.addUser(user2);
    room.addUser(user3);

    // broadcaster message
    const message = WSMessageUtil.serialize({
      type: 'user-joined',
      data: user1,
    } as WSMessage) as string;

    room.broadcast(user1.id, message);

    expect(user1.getWS().send).not.toHaveBeenCalled();
    expect(user2.getWS().send).toHaveBeenCalledOnce();
    expect(user3.getWS().send).toHaveBeenCalledOnce();
  });

  it('should add user to the room', () => {
    const user = new CollabUser('User', 'black', new ws());

    room.addUser(user);
    expect(room.users).toContain(user);
  });

  it('should remove user from the room', () => {
    const user = new CollabUser('User', 'black', new ws());

    room.addUser(user);
    room.removeUser(user.id);

    expect(room.users).not.toContain(user);
  });

  it('should update user', () => {
    const user = new CollabUser('User', 'black', new ws());
    room.addUser(user);

    const updatedUser: User = { id: user.id, name: 'User-2', color: 'blue600' };

    room.updateUser(updatedUser);
    expect(room.users[0]).toEqual(updatedUser);
  });

  it('should check if reached max number of users', () => {
    expect(room.hasReachedMaxUsers()).toBe(false);

    for (let i = 0; i < MAX_USERS; i++) {
      const user = new CollabUser('User', 'black', new ws());
      room.addUser(user);
    }

    expect(room.hasReachedMaxUsers()).toBe(true);
  });

  it('should check if room has multiple users', () => {
    const user1 = new CollabUser('User-1', 'black', new ws());
    const user2 = new CollabUser('User-2', 'blue600', new ws());

    room.addUser(user1);
    expect(room.hasMultipleUsers()).toBe(false);

    room.addUser(user2);
    expect(room.hasMultipleUsers()).toBe(true);
  });

  it('should check if room is empty', () => {
    const user = new CollabUser('User', 'black', new ws());

    room.addUser(user);
    expect(room.isEmpty()).toBe(false);

    room.removeUser(user.id);
    expect(room.isEmpty()).toBe(true);
  });
});

describe('CollabUser', () => {
  it('should init a user correctly', () => {
    const user = new CollabUser('User', 'black', new ws());

    expect(user.id).toHaveLength(36);
    expect(user.name).toBe('User');
    expect(user.color).toBe('black');
  });

  it('should update user', () => {
    const user = new CollabUser('User', 'black', new ws());

    user.update({ color: 'blue700', name: 'User-2' });

    expect(user.color).toBe('blue700');
    expect(user.name).toBe('User-2');
  });

  it('should get ws instance', () => {
    const wsInstance = new ws();

    const user = new CollabUser('User', 'black', wsInstance);

    expect(user.getWS()).toBe(wsInstance);
  });
});

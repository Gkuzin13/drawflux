import type { User } from 'shared';
import * as queries from '@/features/Page/queries/index';
import { COLORS } from './constants';
import type { CollabRoom, CollabUser } from './models';

export function broadcast(
  room: CollabRoom,
  broadcasterId: string,
  message: string,
) {
  room.users.forEach((user) => {
    if (user.id !== broadcasterId) {
      user.getWS().send(message);
    }
  });
}

export async function findPage(id: string) {
  try {
    return (await queries.getPage(id)).page;
  } catch (error) {
    return null;
  }
}

export function getUnusedUserColor(users: CollabUser[]): User['color'] {
  const usedColors = new Set(users.map((user) => user.color));
  return COLORS.find((color) => !usedColors.has(color)) || COLORS[0];
}

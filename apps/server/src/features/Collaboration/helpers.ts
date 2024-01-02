import type { User } from 'shared';
import * as queries from '@/features/Page/queries/index';
import { COLORS, DEFAULT_COLOR } from './constants';
import type { CollabRoom, CollabUser } from './models';

export async function findPage(id: string) {
  try {
    return (await queries.getPage(id)).page;
  } catch (error) {
    return null;
  }
}

export function getUnusedUserColor(users: CollabUser[]): User['color'] {
  if (users.length === 0) {
    return DEFAULT_COLOR;
  }

  const usedColors = new Set(users.map((user) => user.color));
  return COLORS.find((color) => !usedColors.has(color)) || DEFAULT_COLOR;
}

export function createUsername(room: CollabRoom) {
  const suffix = room.hasMultipleUsers() ? ` ${room.users.length}` : '';

  return `New User${suffix}`;
}

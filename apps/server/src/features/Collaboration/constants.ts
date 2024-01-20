import type { User } from 'shared';

export const MAX_USERS = 4;

export const COLORS = [
  'teal600',
  'light-blue600',
  'indigo600',
  'gray600',
] as User['color'][];

export const USER_NAMES = [
  'Blue Cactus',
  'Golden Mango',
  'Smooth Avocado',
  'Ultimate Potato',
] as const;

export const DEFAULT_COLOR = COLORS[3];
export const DEFAULT_NAME = 'New User';

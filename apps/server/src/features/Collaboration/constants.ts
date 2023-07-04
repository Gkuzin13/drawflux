import type { User } from 'shared';

export const MAX_USERS = 4;

export const COLORS = [
  'teal600',
  'light-blue600',
  'indigo600',
  'gray600',
] as User['color'][];

export const DEFAULT_COLOR: User['color'] = 'gray600';

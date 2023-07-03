import * as queries from '@/features/Page/queries/index';
import type { CollabRoom } from './models';

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

import type { WSMessage } from '../types/ws';

export const WSMessageUtil = {
  serialize(message: WSMessage): string | null {
    try {
      return JSON.stringify(message);
    } catch (error) {
      return null;
    }
  },
  deserialize(message: string): WSMessage | null {
    try {
      return JSON.parse(message);
    } catch (error) {
      return null;
    }
  },
};

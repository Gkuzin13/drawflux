import { WebSocket } from 'ws';
import { COLORS, DEFAULT_COLOR } from '../constants';
import { getUnusedUserColor } from '../helpers';
import { CollabUser } from '../models';

const ws = vi.fn(
  () =>
    ({
      send: vi.fn(),
      readyState: WebSocket.OPEN,
    } as unknown as WebSocket),
);

describe('getUnusedUserColor', () => {
  it('should return an unused color', () => {
    const usedColors = [COLORS[0], COLORS[1]];

    const users = usedColors.map((color) => {
      return new CollabUser('User', color, new ws());
    });

    expect(getUnusedUserColor(users)).not.toContain(usedColors);
  });

  it('should return default color if all colors are used or room has no users', () => {
    const usedColors = COLORS;

    const users = usedColors.map((color) => {
      return new CollabUser('User', color, new ws());
    });

    expect(getUnusedUserColor(users)).toBe(DEFAULT_COLOR);
    expect(getUnusedUserColor([])).toBe(DEFAULT_COLOR);
  });
});

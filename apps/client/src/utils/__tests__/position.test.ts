import type { Point } from 'shared';
import { getWidthFromPoints } from '../position';

describe('getWidthFromPoints', () => {
  test('should return the correct width for points', () => {
    const points: Point[] = [
      [1, 2],
      [4, 6],
      [0, 3],
    ];

    const result = getWidthFromPoints(points);

    expect(result).toBe(4); // Expected width: (4 - 0) = 4
  });

  test('should handle negative coordinates', () => {
    const points: Point[] = [
      [-5, 2],
      [-2, 6],
      [0, -1],
    ];

    const result = getWidthFromPoints(points);

    expect(result).toBe(5); // Expected width: |(0) - (-5)| = 5 (abs)
  });

  test('should return 0 for single point', () => {
    const points: Point[] = [[3, 5]];

    const result = getWidthFromPoints(points);

    expect(result).toBe(0); // Only one point, width is 0
  });

  test('should return 0 for empty array', () => {
    const points: Point[] = [];

    const result = getWidthFromPoints(points);

    expect(result).toBe(0); // No points, width is 0
  });
});

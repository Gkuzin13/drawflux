import type { IRect, Vector2d } from 'konva/lib/types';

export function getRatioFromValue(value: number, min: number, max: number) {
  return max === min ? 1 : (value - min) / (max - min);
}

export function getValueFromRatio(ratio: number, min: number, max: number) {
  return ratio * (max - min) + min;
}

export function calculateMiddlePoint(rect: IRect): Vector2d {
  return {
    x: rect.x + rect.x + rect.width / 2,
    y: rect.y + rect.y + rect.height / 2,
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

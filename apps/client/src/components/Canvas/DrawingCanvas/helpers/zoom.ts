import {
  DEFAULT_ZOOM_VALUE,
  ZOOM_RANGE,
  ZOOM_WHEEL_STEP,
} from '@/constants/app';
import { clamp } from '@/utils/math';
import type { Vector2d } from 'konva/lib/types';

type ZoomDirection = -1 | 0 | 1;

export function calculateStageZoomRelativeToPoint(
  oldScale: number,
  point: Vector2d,
  stagePosition: Vector2d,
  direction: ZoomDirection,
) {
  const pointTo = {
    x: (point.x - stagePosition.x) / oldScale,
    y: (point.y - stagePosition.y) / oldScale,
  };

  const scale = calculateScaleFromDirection(oldScale, direction);

  const position = {
    x: (point.x / scale - pointTo.x) * scale,
    y: (point.y / scale - pointTo.y) * scale,
  };

  return { position, scale };
}

function calculateScaleFromDirection(oldScale: number, direction: ZoomDirection) {
  const step = ZOOM_WHEEL_STEP;

  const isReset = direction === 0;

  if (isReset) {
    return DEFAULT_ZOOM_VALUE;
  }

  return clamp(direction > 0 ? oldScale * step : oldScale / step, ZOOM_RANGE);
}

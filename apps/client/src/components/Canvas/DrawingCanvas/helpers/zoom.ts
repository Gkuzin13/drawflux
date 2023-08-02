import { type Vector2d } from 'konva/lib/types';
import { ZOOM_RANGE, ZOOM_WHEEL_STEP } from '@/constants/app';

export function isScaleOutOfRange(scale: number) {
  return scale < ZOOM_RANGE.MIN || scale > ZOOM_RANGE.MAX;
}

export function calculateStageZoom(
  scale: number,
  pointerPosition: Vector2d,
  stagePosition: Vector2d,
  deltaY: number,
) {
  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / scale,
    y: (pointerPosition.y - stagePosition.y) / scale,
  };

  const direction = deltaY > 0 ? -1 : 1;

  const step = ZOOM_WHEEL_STEP;

  const newScale = direction > 0 ? scale * step : scale / step;

  const position = {
    x: pointerPosition.x - mousePointTo.x * newScale,
    y: pointerPosition.y - mousePointTo.y * newScale,
  };

  return { position, scale: newScale };
}

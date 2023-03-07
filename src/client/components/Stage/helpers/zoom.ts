import { Vector2d } from 'konva/lib/types';

export function hasStageScaleReachedLimit(scale: number) {
  if (scale < 0.1 || scale > 2.5) {
    return true;
  }

  return false;
}

export function calcNewStagePositionAndScale(
  oldScale: number,
  pointerPosition: Vector2d,
  stagePosition: Vector2d,
  deltaY: number,
  scaleBy = 1.1,
) {
  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / oldScale,
    y: (pointerPosition.y - stagePosition.y) / oldScale,
  };

  const direction = deltaY > 0 ? -1 : 1;

  const scale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  const position = {
    x: pointerPosition.x - mousePointTo.x * scale,
    y: pointerPosition.y - mousePointTo.y * scale,
  };

  return { position, scale };
}

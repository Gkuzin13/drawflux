import { Util } from 'konva/lib/Util';
import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import type { Point } from 'shared';

const POINTER_SIZE = 1;

export function haveIntersection(rect1: IRect, rect2: IRect) {
  return Util.haveIntersection(rect1, rect2);
}

export function getIntersectingNodes(
  children: (Konva.Shape | Konva.Group)[],
  rect: IRect,
): (Konva.Shape | Konva.Group)[] {
  if (!children.length) {
    return [];
  }

  return children.filter((child) => {
    if (child.hasChildren()) {
      const group = child as Konva.Group;

      return !!getIntersectingNodes(group.getChildren(), rect).length;
    }
    return haveIntersection(rect, child.getClientRect());
  });
}

export function getPointerRect(position: Konva.Vector2d): IRect {
  return {
    x: position.x,
    y: position.y,
    width: POINTER_SIZE,
    height: POINTER_SIZE,
  };
}

export function getLayerNodes(
  layer: Konva.Layer,
): (Konva.Shape | Konva.Group)[] {
  return layer.getChildren((child) => Boolean(child.id()));
}

export function getMainLayer(stage: Konva.Stage) {
  return stage.getLayers()[0];
}

export function getCanvas(stage: Konva.Stage | null) {
  return stage && getMainLayer(stage).getCanvas()._canvas;
}

export function getRelativePointerPosition(stage: Konva.Stage): Point {
  const { x, y } = stage.getRelativePointerPosition() || { x: 0, y: 0 };

  return [x, y];
}

export function getUnregisteredPointerPosition(
  event: Event,
  stage: Konva.Stage,
) {
  stage.setPointersPositions(event);

  return getRelativePointerPosition(stage);
}

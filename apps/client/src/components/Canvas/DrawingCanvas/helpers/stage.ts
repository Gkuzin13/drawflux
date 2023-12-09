import { CURSOR } from '@/constants/cursor';
import type { ToolType } from '@/constants/panels/tools';
import type Konva from 'konva';
import type { IRect, Vector2d } from 'konva/lib/types';
import { Util } from 'konva/lib/Util';
import type { Point } from 'shared';

const POINTER_RECT_SIZE = 32;

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
    return Util.haveIntersection(rect, child.getClientRect());
  });
}

export function getPointerRect(position: Vector2d, scale: number): IRect {
  const rectSize = POINTER_RECT_SIZE * scale;

  return {
    width: rectSize,
    height: rectSize,
    x: position.x,
    y: position.y,
  };
}

export function getLayerNodes(
  layer: Konva.Layer,
): (Konva.Shape | Konva.Group)[] {
  return layer.getChildren((child) => Boolean(child.id()));
}

export function getCursorStyle(
  toolType: ToolType,
  dragging: boolean,
  drawing: boolean,
) {
  switch (toolType) {
    case 'hand':
      return dragging ? CURSOR.GRABBING : CURSOR.GRAB;
    case 'select':
      return CURSOR.DEFAULT;
    default:
      return drawing ? CURSOR.CROSSHAIR : CURSOR.DEFAULT;
  }
}

export function getMainLayer(stage: Konva.Stage) {
  return stage.getLayers()[0];
}

export function getRelativePointerPosition(stage: Konva.Stage): Point {
  const { x, y } = stage.getRelativePointerPosition() || { x: 0, y: 0 };

  return [x, y];
}

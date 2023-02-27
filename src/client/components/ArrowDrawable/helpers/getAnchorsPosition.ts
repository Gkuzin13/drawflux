import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { Shape } from 'konva/lib/Shape';

export const getAnchorsPosition = (
  arrowGroup: Konva.Group & Shape,
): Point[] => {
  return arrowGroup
    .getChildren((child) => child.className === 'Circle')
    .map((child) => {
      const { x, y } = child.getAbsolutePosition();
      return [x, y];
    });
};

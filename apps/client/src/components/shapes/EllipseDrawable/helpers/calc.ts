import type Konva from 'konva';

export function getEllipseRadius(ellipse: Konva.Ellipse) {
  return {
    radiusX: (ellipse.width() * ellipse.scaleX()) / 2,
    radiusY: (ellipse.height() * ellipse.scaleY()) / 2,
  };
}

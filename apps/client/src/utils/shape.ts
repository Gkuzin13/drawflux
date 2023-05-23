import type { NodeColor, NodeLine, NodeSize } from 'shared';
import { colors } from 'shared';

export function getDashValue(
  shapeLength: number,
  strokeWidth: number,
  lineStyle: NodeLine,
) {
  let ratio = 1;
  let dashLength = 0;
  let dashGap = 0;

  switch (lineStyle) {
    case 'dashed':
      dashLength = Math.min(strokeWidth * 2, shapeLength / 4);
      break;
    case 'dotted':
      ratio = 8;
      dashLength = strokeWidth / ratio;
      break;
    default:
      return [];
  }

  let dashCount = Math.floor(shapeLength / dashLength / (2 * ratio));
  dashCount = Math.max(dashCount, 3);

  dashLength = shapeLength / dashCount / (2 * ratio);
  dashGap = (shapeLength - dashCount * dashLength) / dashCount;

  return [dashLength, dashGap];
}

export function getSizeValue(key: NodeSize) {
  switch (key) {
    case 'small':
      return 2;
    case 'medium':
      return 4;
    case 'large':
      return 6;
    case 'extra-large':
      return 8;
    default:
      return 4;
  }
}

export function getColorValue(key: NodeColor): (typeof colors)[NodeColor] {
  if (key in colors) {
    return colors[key];
  }

  return '#000000';
}

import { defaultTheme, darkTheme } from 'shared';
import { hexToRGBa } from './string';
import { getShapeLength } from './math';
import type {
  NodeColor,
  NodeFill,
  NodeLine,
  NodeObject,
  NodeSize,
  ThemeColorValue,
  ThemeColors,
} from 'shared';
import type { ShapeConfig } from 'konva/lib/Shape';

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
      return 3;
    case 'large':
      return 5;
    case 'extra-large':
      return 8;
    default:
      return 3;
  }
}

export function getColorValue(
  key: NodeColor,
  themeColors: ThemeColors,
): ThemeColorValue {
  if (key in themeColors) {
    return themeColors[key].value;
  }

  return themeColors.black.value;
}

export function getFillValue(fill: NodeFill, colorValue: ThemeColorValue) {
  switch (fill) {
    case 'semi': {
      return 'transparent';
    }
    case 'solid': {
      return hexToRGBa(colorValue, 0.25);
    }
    default:
      return undefined;
  }
}

export function getDashStyle(node: NodeObject, sizeValue: number, scale: number) {
  if (node.style.line === 'solid') {
    return [];
  }

  const shapeLength = getShapeLength(node) * scale;
  const strokeWidth = sizeValue * scale;

  return getDashValue(shapeLength, strokeWidth, node.style.line);
}

export function getTotalDashLength(dash: ShapeConfig['dash']) {
  return Array.isArray(dash) && dash.length > 1 ? dash[0] + dash[1] : 0;
}

export function getFontSize(size: number) {
  return size * 8;
}

export function getCurrentThemeColors({
  isDarkTheme,
}: {
  isDarkTheme: boolean;
}) {
  return isDarkTheme ? darkTheme.colors : defaultTheme.colors;
}

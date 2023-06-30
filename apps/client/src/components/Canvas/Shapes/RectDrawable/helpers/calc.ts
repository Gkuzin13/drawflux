import type Konva from 'konva';
import { RECT } from '@/constants/shape';

export function getRectSize(rect: Konva.Rect) {
  return {
    width: Math.max(RECT.MIN_SIZE, rect.width() * rect.scaleX()),
    height: Math.max(RECT.MIN_SIZE, rect.height() * rect.scaleY()),
  };
}

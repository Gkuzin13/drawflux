import { TRANSFORMER } from '@/constants/shape';
import type { Box } from 'konva/lib/shapes/Transformer';

export function normalizeTransformerSize(oldBox: Box, newBox: Box) {
  if (
    newBox.width < TRANSFORMER.MIN_SIZE ||
    newBox.height < TRANSFORMER.MIN_SIZE
  ) {
    return oldBox;
  }

  return newBox;
}

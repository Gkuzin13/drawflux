import { memo } from 'react';
import { Rect } from 'react-konva';
import { getNormalizedInvertedRect } from '@/utils/position';
import useThemeColors from '@/hooks/useThemeColors';
import type { IRect } from 'konva/lib/types';

type Props = {
  stageScale: number;
} & IRect;

const CanvasBackground = ({ x, y, width, height, stageScale }: Props) => {
  const themeColors = useThemeColors();

  const normalizedRect = getNormalizedInvertedRect(
    { x, y, width, height },
    stageScale,
  );

  return (
    <Rect
      {...normalizedRect}
      perfectDrawEnabled={false}
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      listening={false}
      draggable={false}
      fill={themeColors['canvas-bg'].value}
    />
  );
};

export default memo(CanvasBackground);

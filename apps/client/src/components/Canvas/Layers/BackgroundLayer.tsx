import { memo } from 'react';
import { Rect } from 'react-konva';
import { getNormalizedInvertedRect } from '@/utils/position';
import type { IRect } from 'konva/lib/types';
import useThemeColors from '@/hooks/useThemeColors';

type Props = {
  rect: IRect;
  scale: number;
};

const Background = ({ scale, rect }: Props) => {
  const themeColors = useThemeColors();

  const normalizedRect = getNormalizedInvertedRect(rect, scale);

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

export default memo(Background);

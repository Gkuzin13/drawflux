import type Konva from 'konva';
import { memo, forwardRef } from 'react';
import { Rect } from 'react-konva';
import { theme } from 'shared';
import { getNormalizedInvertedRect } from '@/utils/position';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  stageScale: number;
};

const BackgroundRect = forwardRef<Konva.Rect, Props>(
  ({ stageScale, x, y, width, height }, ref) => {
    const normalizedRect = getNormalizedInvertedRect(
      {
        x,
        y,
        width,
        height,
      },
      stageScale,
    );

    return (
      <Rect
        ref={ref}
        {...normalizedRect}
        perfectDrawEnabled={false}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        listening={false}
        draggable={false}
        fill={theme.colors.gray50.value}
      />
    );
  },
);

BackgroundRect.displayName = 'BackgroundRect';

export default memo(BackgroundRect);

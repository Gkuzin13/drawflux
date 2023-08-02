import type Konva from 'konva';
import { forwardRef, memo, type RefObject } from 'react';
import { Rect } from 'react-konva';
import { theme } from 'shared';
import { getNormalizedInvertedRect } from '@/utils/position';
import type { IRect } from 'konva/lib/types';

type Props = {
  rect: IRect;
  scale: number;
  ref: RefObject<Konva.Rect>;
};

const BackgroundLayer = forwardRef<Konva.Rect, Props>(
  ({ scale, rect }, ref) => {
    const normalizedRect = getNormalizedInvertedRect(rect, scale);
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

BackgroundLayer.displayName = 'BackgroundLayer';

export default memo(BackgroundLayer);

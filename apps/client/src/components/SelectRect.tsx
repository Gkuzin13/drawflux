import type Konva from 'konva';
import { type PropsWithRef, forwardRef, useMemo } from 'react';
import { Rect } from 'react-konva';
import { type Point, theme } from 'shared';
import { drawRectangle } from '@/utils/draw';

type Props = PropsWithRef<{
  startPoint: Point;
  currentPoint: Point;
}>;

const SelectRect = forwardRef<Konva.Rect, Props>(
  ({ startPoint, currentPoint }, ref) => {
    const rect = useMemo(() => {
      return drawRectangle([startPoint, currentPoint]);
    }, [startPoint, currentPoint]);

    return (
      <Rect
        ref={ref}
        stroke={theme.colors.gray600.value}
        fill={theme.colors.gray400.value}
        opacity={0.1}
        {...rect}
      />
    );
  },
);

SelectRect.displayName = 'SelectRect';

export default SelectRect;

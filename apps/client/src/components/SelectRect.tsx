import type Konva from 'konva';
import { type PropsWithRef, forwardRef, useMemo } from 'react';
import { Rect } from 'react-konva';
import { type Point, theme } from 'shared';
import { drawRectangle } from '@/utils/draw';

type Props = PropsWithRef<{
  active: boolean;
  startPoint: Point;
  currentPoint: Point;
}>;

const SelectRect = forwardRef<Konva.Rect, Props>(
  ({ active, startPoint, currentPoint }, ref) => {
    const rect = useMemo(() => {
      return drawRectangle([startPoint, currentPoint]);
    }, [startPoint, currentPoint]);

    return (
      <Rect
        ref={ref}
        {...rect}
        stroke={theme.colors.gray600.value}
        fill={theme.colors.gray400.value}
        opacity={0.1}
        visible={active}
        listening={false}
      />
    );
  },
);

SelectRect.displayName = 'SelectRect';

export default SelectRect;

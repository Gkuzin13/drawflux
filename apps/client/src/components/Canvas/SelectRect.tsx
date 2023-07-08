import type Konva from 'konva';
import { type PropsWithRef, forwardRef } from 'react';
import { Rect } from 'react-konva';
import { type Point, theme } from 'shared';
import { drawRectangle } from '@/utils/draw';

type Props = PropsWithRef<{
  position: {
    start: Point;
    current: Point;
  };
}>;

const SelectRect = forwardRef<Konva.Rect, Props>(({ position }, ref) => {
  const rect = drawRectangle([position.start, position.current]);

  return (
    <Rect
      ref={ref}
      {...rect}
      stroke={theme.colors.gray600.value}
      fill={theme.colors.gray400.value}
      opacity={0.1}
      listening={false}
    />
  );
});

SelectRect.displayName = 'SelectRect';

export default SelectRect;

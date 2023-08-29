import type Konva from 'konva';
import { forwardRef } from 'react';
import { Rect } from 'react-konva';
import { type Point } from 'shared';
import { drawRectangle } from '@/utils/draw';
import { SELECT_RECT } from '@/constants/shape';

export type SelectRectProps = {
  position: {
    start: Point;
    current: Point;
  };
};

const SelectRect = forwardRef<Konva.Rect, SelectRectProps>(
  ({ position }, ref) => {
    const rect = drawRectangle([position.start, position.current]);

    return (
      <Rect
        ref={ref}
        {...rect}
        stroke={SELECT_RECT.STROKE}
        fill={SELECT_RECT.FILL}
        opacity={SELECT_RECT.OPACITY}
        listening={false}
      />
    );
  },
);

SelectRect.displayName = 'SelectRect';

export default SelectRect;

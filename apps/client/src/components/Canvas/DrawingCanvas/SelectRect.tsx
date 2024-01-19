import { Rect } from 'react-konva';
import { drawRectangle } from '@/utils/draw';
import { SELECT_RECT } from '@/constants/shape';
import { baseConfig } from '@/hooks/useNode/useNode';
import { forwardRef } from 'react';
import type { DrawPosition } from './helpers/draw';
import type Konva from 'konva';

export type Props = {
  position: DrawPosition;
};

const SelectRect = forwardRef<Konva.Rect, Props>(({ position }, ref) => {
  const rect = drawRectangle([position.start, position.current]);

  return (
    <Rect
      ref={ref}
      {...rect}
      {...baseConfig}
      cornerRadius={SELECT_RECT.CORNER_RADIUS}
      stroke={SELECT_RECT.STROKE}
      fill={SELECT_RECT.FILL}
      opacity={SELECT_RECT.OPACITY}
      listening={false}
      draggable={false}
      fillEnabled={true}
    />
  );
});

SelectRect.displayName = 'SelectRect';

export default SelectRect;

import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import { type PropsWithRef, forwardRef } from 'react';
import { Rect } from 'react-konva';
import { theme } from 'shared';

type Props = PropsWithRef<{
  rect: IRect;
}>;

type Ref = Konva.Rect;

const SelectTool = forwardRef<Ref, Props>(({ rect }, ref) => {
  return (
    <Rect
      ref={ref}
      stroke={theme.colors.gray600.value}
      fill={theme.colors.gray400.value}
      opacity={0.1}
      width={rect.width}
      height={rect.height}
      x={rect.x}
      y={rect.y}
    />
  );
});

SelectTool.displayName = 'SelectTool';

export default SelectTool;

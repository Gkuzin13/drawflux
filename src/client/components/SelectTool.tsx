import Konva from 'konva';
import { IRect } from 'konva/lib/types';
import { ForwardedRef, forwardRef } from 'react';
import { Rect } from 'react-konva';
import { theme } from '../shared/styles/theme';

type Props = {
  rect: IRect;
};

const SelectTool = forwardRef(
  ({ rect }: Props, ref: ForwardedRef<Konva.Rect>) => {
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
  },
);

SelectTool.displayName = 'SelectTool';

export default SelectTool;

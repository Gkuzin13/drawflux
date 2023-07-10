import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import { type ForwardedRef, useMemo, memo, forwardRef } from 'react';
import { Rect } from 'react-konva';
import { type StageConfig, theme } from 'shared';
import { getNormalizedInvertedRect } from '@/utils/position';

type Props = {
  stageRef: ForwardedRef<Konva.Stage>;
  stageConfig: StageConfig;
};

const BackgroundRect = forwardRef<Konva.Rect, Props>(
  ({ stageRef, stageConfig }, ref) => {
    const adjustedRect = useMemo<IRect>(() => {
      if (typeof stageRef === 'function' || !stageRef?.current) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }

      const stage = stageRef.current;

      const { position, scale } = stageConfig;
      const rect = {
        x: position.x,
        y: position.y,
        width: stage.width(),
        height: stage.height(),
      };

      return getNormalizedInvertedRect(rect, scale);
    }, [stageConfig, stageRef]);

    return (
      <Rect
        ref={ref}
        {...adjustedRect}
        perfectDrawEnabled={false}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        listening={false}
        draggable={false}
        fill={theme.colors.white50.value}
      />
    );
  },
);

BackgroundRect.displayName = 'BackgroundRect';

export default memo(BackgroundRect);

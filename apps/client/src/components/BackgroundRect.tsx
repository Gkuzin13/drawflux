import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import { type ForwardedRef, useMemo, memo } from 'react';
import { Rect } from 'react-konva';
import { type StageConfig, theme } from 'shared';
import { BACKGROUND_LAYER_ID } from '@/constants/node';

type Props = {
  stageRef: ForwardedRef<Konva.Stage>;
  stageConfig: StageConfig;
};

const BackgroundRect = memo(({ stageRef, stageConfig }: Props) => {
  const normalizedRect = useMemo<IRect>(() => {
    if (!stageRef || typeof stageRef === 'function' || !stageRef.current) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    const stage = stageRef.current;

    const { position, scale } = stageConfig;

    return {
      x: -position.x / scale,
      y: -position.y / scale,
      width: stage.width() / scale,
      height: stage.height() / scale,
    };
  }, [stageConfig, stageRef]);

  return (
    <Rect
      id={BACKGROUND_LAYER_ID}
      {...normalizedRect}
      perfectDrawEnabled={false}
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      fill={theme.colors.white50.value}
      listening={false}
      draggable={false}
    />
  );
});

BackgroundRect.displayName = 'BackgroundRect';

export default BackgroundRect;

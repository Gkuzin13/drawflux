import type Konva from 'konva';
import { Animation } from 'konva/lib/Animation';
import { type RefObject, useEffect, useMemo } from 'react';
import { clamp } from '@/utils/math';

export type UseAnimatedDashElement =
  | Konva.Shape
  | Konva.Rect
  | Konva.Ellipse
  | Konva.Line;

type UseAnimatedDashArgs = {
  enabled?: boolean;
  elementRef: RefObject<UseAnimatedDashElement | null>;
  totalDashLength: number;
};

const useAnimatedDash = ({
  enabled,
  elementRef,
  totalDashLength,
}: UseAnimatedDashArgs) => {
  const animation = useMemo(() => {
    if (!elementRef.current || !enabled) {
      return null;
    }

    const element = elementRef.current;
    const speedFactor = clamp(35 * totalDashLength, 650, 750);

    return new Animation((frame) => {
      if (!frame) return;

      const time = frame.time / speedFactor;
      const offset = totalDashLength * ((time * 2) % 2);

      element.dashOffset(-offset);
    }, element.getLayer());
  }, [elementRef.current, totalDashLength, enabled]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    if (enabled && !animation.isRunning()) {
      animation.start();
    }

    return () => {
      animation.stop();
    };
  }, [enabled, animation]);

  return { animation };
};

export default useAnimatedDash;

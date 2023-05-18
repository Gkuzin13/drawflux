import type Konva from 'konva';
import { Animation } from 'konva/lib/Animation';
import { type RefObject, useEffect, useState } from 'react';

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
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const element = elementRef.current;

    const animation = new Animation((frame) => {
      if (!frame) return;

      const time = frame.time / 600;
      const offset = totalDashLength * ((time * 2) % 2);

      element.dashOffset(-offset);
    }, element.getLayer());

    if (enabled && !animation.isRunning()) {
      animation.start();
    }

    if (!enabled && animation.isRunning()) {
      animation.stop();
    }

    setIsRunning(animation.isRunning());

    return () => {
      animation.stop();
      setIsRunning(false);
    };
  }, [elementRef, totalDashLength, enabled]);

  return { isRunning };
};

export default useAnimatedDash;

import type Konva from 'konva';
import { Animation } from 'konva/lib/Animation';
import { type RefObject, useEffect } from 'react';

type Element = Konva.Shape | Konva.Rect | Konva.Ellipse | Konva.Line;

type UseAnimatedLineArgs = {
  enabled?: boolean;
  elementRef: RefObject<Element | null>;
  totalDashLength: number;
};

const useAnimatedLine = ({
  enabled,
  elementRef,
  totalDashLength,
}: UseAnimatedLineArgs) => {
  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const element = elementRef.current;

    function animateDashOffset(element: Element) {
      return new Animation((frame) => {
        if (!frame) return;

        const time = frame.time / 600;
        const offset = totalDashLength * ((time * 2) % 2);

        element.dashOffset(-offset);
      });
    }

    const animation = animateDashOffset(element);

    if (enabled) {
      animation.start();
    }

    if (!enabled && animation.isRunning()) {
      animation.stop();
    }

    return () => {
      animation.stop();
    };
  }, [elementRef, totalDashLength, enabled]);
};

export default useAnimatedLine;

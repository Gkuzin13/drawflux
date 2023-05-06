import type Konva from 'konva';
import { Animation } from 'konva/lib/Animation';
import { type RefObject, useEffect } from 'react';

type UseAnimatedLineArgs = {
  enabled?: boolean;
  elementRef: RefObject<
    Konva.Shape | Konva.Rect | Konva.Ellipse | Konva.Line | null
  >;
  maxOffset: number;
};

const useAnimatedLine = ({
  enabled,
  elementRef,
  maxOffset,
}: UseAnimatedLineArgs) => {
  useEffect(() => {
    const element = elementRef.current;

    function animateDashOffset() {
      return new Animation((frame) => {
        if (!frame) return;

        const time = frame.time / 600;
        const offset = maxOffset * ((time * 2) % 2);

        element?.dashOffset(-offset);
      }, element?.getLayer());
    }

    const anim = animateDashOffset();

    if (enabled) {
      anim.start();
    }

    if (!enabled && anim.isRunning()) {
      anim.stop();
    }

    return () => {
      anim.stop();
    };
  }, [elementRef, maxOffset, enabled]);
};

export default useAnimatedLine;

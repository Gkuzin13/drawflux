import { type NodeStyle } from '@shared';
import Konva from 'konva';
import { type Shape } from 'konva/lib/Shape';
import { type Ellipse } from 'konva/lib/shapes/Ellipse';
import { type Line } from 'konva/lib/shapes/Line';
import { type Rect } from 'konva/lib/shapes/Rect';
import { useEffect } from 'react';

const useAnimatedLine = (
  element: Shape | Rect | Ellipse | Line | null,
  maxOffset: number,
  animated: NodeStyle['animated'],
  lineStyle: NodeStyle['line'],
) => {
  useEffect(() => {
    function animateDashOffset() {
      return new Konva.Animation((frame) => {
        if (!frame) return;

        const time = frame.time / 600;
        const offset = maxOffset * ((time * 2) % 2);

        element?.dashOffset(-offset);
      }, element?.getLayer());
    }

    const anim = animateDashOffset();

    if (animated) {
      anim.start();
    }

    if (!animated && anim.isRunning()) {
      anim.stop();
    }

    return () => {
      anim.stop();
    };
  }, [element, maxOffset, animated, lineStyle]);
};

export default useAnimatedLine;

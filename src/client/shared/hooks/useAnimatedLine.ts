import Konva from 'konva';
import { Shape } from 'konva/lib/Shape';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { useCallback, useEffect } from 'react';
import { NodeStyle } from '../constants/element';

const useAnimatedLine = (
  element: Shape | Rect | Ellipse | Line | null,
  maxOffset: number,
  animated: NodeStyle['animated'],
  lineStyle: NodeStyle['line'],
) => {
  const animateDashOffset = useCallback(() => {
    return new Konva.Animation((frame) => {
      if (!frame) return;

      const time = frame.time / 600;
      const offset = maxOffset * ((time * 2) % 2);

      element?.dashOffset(-offset);
    }, element?.getLayer());
  }, [element, animated, maxOffset, lineStyle]);

  useEffect(() => {
    const anim = animateDashOffset();

    if (animated) {
      anim.start();
    } else {
      anim.stop();
    }
    return () => {
      anim.stop();
    };
  }, [element, maxOffset, animated, lineStyle]);
};

export default useAnimatedLine;

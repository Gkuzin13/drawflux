import { Shape } from 'konva/lib/Shape';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { useEffect, useState } from 'react';
import { NodeStyle } from '../element';

const useAnimatedLine = (
  element: Shape | Rect | Ellipse | Line | null,
  maxOffset: number,
  animated: NodeStyle['animated'],
  lineStyle: NodeStyle['line'],
  speed = 1,
) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (animated) {
      start();
      setAnimating(true);
    } else {
      stop();
      setAnimating(false);
    }

    return () => {
      stop();
      setAnimating(false);
    };
  }, [animated, lineStyle, element]);

  let offset = 0;

  const { start, stop } = animate(() => {
    if (!element) return;

    offset = offset + normalizeSpeed(speed);

    if (offset > maxOffset) {
      offset = 0;
    }

    element.dashOffset(-offset);
  }, 60);

  function animate(callback: () => void, frameRate = 60) {
    let requestId = 0;

    function start() {
      let then = performance.now();
      const interval = 1000 / frameRate;
      const tolerance = 0.1;

      const animateLoop = (now: number) => {
        requestId = requestAnimationFrame(animateLoop);

        const delta = now - then;
        if (delta >= interval - tolerance) {
          then = now - (delta % interval);
          callback();
        }
      };
      requestId = requestAnimationFrame(animateLoop);
    }

    function stop() {
      cancelAnimationFrame(requestId);
    }

    return { start, stop };
  }

  function normalizeSpeed(value: number) {
    if (value < 0) {
      return 0.1;
    }

    if (value > 2) {
      return 2;
    }

    return value;
  }

  return { animating };
};

export default useAnimatedLine;

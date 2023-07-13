import { type RefObject, useEffect, useRef } from 'react';
import { Animation } from 'konva/lib/Animation';
import { clamp } from '@/utils/math';
import type Konva from 'konva';

export type UseAnimatedDashNode =
  | Konva.Shape
  | Konva.Rect
  | Konva.Ellipse
  | Konva.Line;

type UseAnimatedDashArgs = {
  enabled?: boolean;
  nodeRef: RefObject<UseAnimatedDashNode | null>;
  totalDashLength: number;
};

const useAnimatedDash = ({
  nodeRef,
  enabled,
  totalDashLength,
}: UseAnimatedDashArgs) => {
  const animationRef = useRef<Konva.Animation | null>(null);
  const totalDashLengthRef = useRef(0);

  useEffect(() => {
    if (!isNaN(totalDashLength)) {
      totalDashLengthRef.current = totalDashLength;
    }
  }, [totalDashLength]);

  useEffect(() => {
    if (!nodeRef.current) return;

    const node = nodeRef.current;

    if (!animationRef.current) {
      const speedFactor = clamp(35 * totalDashLengthRef.current, 650, 750);

      animationRef.current = new Animation((frame) => {
        if (!frame) return;

        const time = frame.time / speedFactor;
        const offset = totalDashLengthRef.current * ((time * 2) % 2);

        node.dashOffset(-offset);
      }, node.getLayer());
    }

    const animation = animationRef.current;

    if (enabled && !animation.isRunning()) {
      animation.start();
    } else if (!enabled && animation.isRunning()) {
      animation.stop();
    }

    return () => {
      animation.stop();
    };
  }, [enabled, nodeRef]);

  return { animation: animationRef.current };
};

export default useAnimatedDash;

import { useCallback, useEffect, useRef, useState } from 'react';
import { Shape } from 'react-konva';
import { baseConfig } from '@/hooks/useNode/useNode';
import { Animation } from 'konva/lib/Animation';
import { LASER } from '@/constants/shape';
import { now } from '@/utils/is';
import { calculateMidPointFromRange } from '@/utils/math';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import type Konva from 'konva';

const LaserDrawable = ({
  node,
  stageScale,
  onNodeDelete,
}: NodeComponentProps<'laser'>) => {
  const [path, setPath] = useState(node.nodeProps.points ?? []);

  const lastDrawTime = useRef(now());

  useEffect(() => {
    setPath((prevPath) => {
      if (!node.nodeProps.points?.length) return prevPath;

      const updatedPath = [node.nodeProps.points[0], ...prevPath];

      if (updatedPath.length > LASER.MAX_LENGTH) {
        return updatedPath.slice(0, -LASER.TRIM_COUNT);
      }

      return updatedPath;
    });

    lastDrawTime.current = now();
  }, [node.nodeProps.points]);

  useEffect(() => {
    const pathTrimmingAnimation = new Animation((frame) => {
      if (
        !frame ||
        frame.time % (LASER.TRIM_INTERVAL * 2) > LASER.TRIM_INTERVAL
      ) {
        return;
      }
      const pastTrimDelay = now() - lastDrawTime.current > LASER.TRIM_DELAY;

      if (pastTrimDelay) {
        setPath((prevPath) => prevPath.slice(0, -LASER.TRIM_COUNT));
      }
    });

    pathTrimmingAnimation.start();

    return () => {
      pathTrimmingAnimation.stop();
    };
  }, []);

  useEffect(() => {
    if (!path.length) {
      onNodeDelete && onNodeDelete(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, onNodeDelete]);

  const drawPath = useCallback(
    (ctx: Konva.Context, shape: Konva.Shape) => {
      if (!path.length) return;

      const startPoint = path[0];

      ctx.lineCap = 'round';
      ctx.strokeStyle = LASER.COLOR;

      ctx.moveTo(startPoint[0], startPoint[0]);

      ctx.beginPath();

      for (const [index, point] of path.entries()) {
        const indexRatio = index / path.length;
        const prevPoint = path[index - 1] ?? point;
        const controlPoint = calculateMidPointFromRange(prevPoint, point);

        ctx.quadraticCurveTo(
          prevPoint[0],
          prevPoint[1],
          controlPoint[0],
          controlPoint[1],
        );

        ctx.lineWidth = ((1 - indexRatio) * LASER.WIDTH) / stageScale;

        ctx.stroke();
      }

      ctx.fillStrokeShape(shape);
    },
    [path, stageScale],
  );

  return (
    <Shape
      {...baseConfig}
      draggable={false}
      listening={false}
      shadowEnabled={false}
      dashEnabled={false}
      sceneFunc={drawPath}
    />
  );
};

export default LaserDrawable;

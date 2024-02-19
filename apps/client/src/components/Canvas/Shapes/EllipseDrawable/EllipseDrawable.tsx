import { useCallback, useRef } from 'react';
import { Ellipse } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { calculateCircumference } from '@/utils/math';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import { getEllipseRadius } from './helpers/calc';
import { ELLIPSE } from '@/constants/shape';
import type Konva from 'konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const EllipseDrawable = ({
  node,
  stageScale,
}: NodeComponentProps<'ellipse'>) => {
  const nodeRef = useRef<Konva.Ellipse>(null);

  const { config } = useNode(node, stageScale);
  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const radiusX = Math.max(node.nodeProps.width ?? 0, ELLIPSE.MIN_RADIUS);
  const radiusY = Math.max(node.nodeProps.height ?? 0, ELLIPSE.MIN_RADIUS);

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handlTransform = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const ellipse = event.target as Konva.Ellipse;

      const { radiusX, radiusY } = getEllipseRadius(ellipse);

      const totalLength = calculateCircumference(radiusX, radiusY);

      const dash = getDashValue(
        totalLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      ellipse.dash(dash.map((d) => d * stageScale));
    },
    [node.style.size, node.style.line, stageScale],
  );

  const handleTransformEnd = useCallback(() => {
    if (node.style.animated && animation?.isRunning() === false) {
      animation.start();
    }
  }, [node, animation]);

  return (
    <Ellipse
      ref={nodeRef}
      radiusX={radiusX}
      radiusY={radiusY}
      x={node.nodeProps.point[0]}
      y={node.nodeProps.point[1]}
      {...config}
      onTransformStart={handleTransformStart}
      onTransform={handlTransform}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default EllipseDrawable;

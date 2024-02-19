import { useCallback, useMemo, useRef } from 'react';
import { Rect } from 'react-konva';
import { RECT } from '@/constants/shape';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { calculatePerimeter } from '@/utils/math';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import { getRectSize } from './helpers/calc';
import type Konva from 'konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const RectDrawable = ({
  node,
  stageScale,
}: NodeComponentProps<'rectangle'>) => {
  const nodeRef = useRef<Konva.Rect>(null);

  const { config } = useNode(node, stageScale);
  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handlTransform = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const rect = event.target as Konva.Rect;

      const { width, height } = getRectSize(rect);

      const totalLength = calculatePerimeter(width, height, RECT.CORNER_RADIUS);

      const dash = getDashValue(
        totalLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      rect.scale({ x: 1, y: 1 });

      rect.width(width);
      rect.height(height);
      rect.dash(dash.map((d) => d * stageScale));
    },
    [node.style.size, node.style.line, stageScale],
  );

  const handleTransformEnd = useCallback(() => {
    if (node.style.animated && animation?.isRunning() === false) {
      animation.start();
    }
  }, [node, animation]);

  // Sanitize rect size
  const { width, height } = useMemo(() => {
    return {
      width: Math.max(
        Number(node.nodeProps.width ?? RECT.MIN_SIZE),
        RECT.MIN_SIZE,
      ),
      height: Math.max(
        Number(node.nodeProps.height ?? RECT.MIN_SIZE),
        RECT.MIN_SIZE,
      ),
    };
  }, [node.nodeProps.width, node.nodeProps.height]);
  
  return (
    <Rect
      ref={nodeRef}
      {...config}
      x={node.nodeProps.point[0]}
      y={node.nodeProps.point[1]}
      width={width}
      height={height}
      cornerRadius={RECT.CORNER_RADIUS}
      onTransformStart={handleTransformStart}
      onTransform={handlTransform}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default RectDrawable;

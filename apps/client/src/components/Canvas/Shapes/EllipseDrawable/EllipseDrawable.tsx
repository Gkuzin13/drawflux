import { useCallback } from 'react';
import { Ellipse } from 'react-konva';
import NodeTransformer from '@/components/Canvas/Transformer/NodeTransformer';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { calculateCircumference } from '@/utils/math';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import { getEllipseRadius } from './helpers/calc';
import { ELLIPSE } from '@/constants/shape';
import type Konva from 'konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const EllipseDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'ellipse'>) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Ellipse>([selected]);

  const { config } = useNode(node, stageScale);
  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const radiusX = Math.max(node.nodeProps.width ?? 0, ELLIPSE.MIN_RADIUS);
  const radiusY = Math.max(node.nodeProps.height ?? 0, ELLIPSE.MIN_RADIUS);

  const handleDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      onNodeChange({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          point: [event.target.x(), event.target.y()],
        },
      });
    },
    [node, onNodeChange],
  );

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

  const handleTransformEnd = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const ellipse = event.target as Konva.Ellipse;

      const { radiusX, radiusY } = getEllipseRadius(ellipse);

      onNodeChange({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          point: [ellipse.x(), ellipse.y()],
          width: radiusX,
          height: radiusY,
          rotation: ellipse.rotation(),
        },
      });

      if (node.style.animated && animation?.isRunning() === false) {
        animation.start();
      }

      ellipse.scale({ x: 1, y: 1 });
    },
    [node, animation, onNodeChange],
  );

  return (
    <>
      <Ellipse
        ref={nodeRef}
        radiusX={radiusX}
        radiusY={radiusY}
        x={node.nodeProps.point[0]}
        y={node.nodeProps.point[1]}
        {...config}
        onDragEnd={handleDragEnd}
        onTransformStart={handleTransformStart}
        onTransform={handlTransform}
        onTransformEnd={handleTransformEnd}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          stageScale={stageScale}
          transformerConfig={{ keepRatio: false }}
        />
      )}
    </>
  );
};

export default EllipseDrawable;

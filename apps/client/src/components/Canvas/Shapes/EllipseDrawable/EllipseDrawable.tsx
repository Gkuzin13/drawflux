import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback } from 'react';
import { Ellipse } from 'react-konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import NodeTransformer from '@/components/Canvas/Transformer/NodeTransformer';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { calculateCircumference } from '@/utils/math';
import { getDashValue, getSizeValue } from '@/utils/shape';
import { getEllipseRadius } from './helpers/calc';

const EllipseDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Ellipse>([selected]);

  const { config } = useNode(node, stageScale);
  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: config.dash[0] + config.dash[1],
  });

  const handleDragEnd = useCallback(
    (event: KonvaEventObject<DragEvent>) => {
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
    (event: KonvaEventObject<Event>) => {
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
    (event: KonvaEventObject<Event>) => {
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
        radiusX={node.nodeProps.width || 0}
        radiusY={node.nodeProps.height || 0}
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
          transformerConfig={{ keepRatio: false }}
        />
      )}
    </>
  );
};

export default EllipseDrawable;

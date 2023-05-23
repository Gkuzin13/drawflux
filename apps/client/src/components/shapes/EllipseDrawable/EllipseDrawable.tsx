import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback } from 'react';
import { Ellipse } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import { calculateCircumference } from '@/utils/math';
import { getDashValue, getSizeValue } from '@/utils/shape';
import { getEllipseRadius } from './helpers/calc';

const EllipseDrawable = memo<NodeComponentProps>(
  ({ node, selected, draggable, onNodeChange, onPress }) => {
    const { nodeRef, transformerRef } = useTransformer<Konva.Ellipse>([
      selected,
    ]);

    const { stageConfig } = useAppSelector(selectCanvas);
    const { config } = useNode(node, stageConfig);
    const { animation } = useAnimatedDash({
      enabled: node.style.animated,
      elementRef: nodeRef,
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
        onPress(node.nodeProps.id);
      },
      [node, onNodeChange, onPress],
    );

    const handleTransformStart = useCallback(
      (event: KonvaEventObject<Event>) => {
        const ellipse = event.target as Konva.Ellipse;

        ellipse.dashOffset(0);

        if (node.style.animated && animation) {
          animation.stop();
        }
      },
      [node.style.animated, animation],
    );

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

        ellipse.dash(dash.map((d) => d * stageConfig.scale));
      },
      [node.style.size, node.style.line, stageConfig.scale],
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

        if (node.style.animated && animation && !animation.isRunning()) {
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
          draggable={draggable}
          onDragEnd={handleDragEnd}
          onTransformStart={handleTransformStart}
          onTransform={handlTransform}
          onTransformEnd={handleTransformEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        />
        {selected && (
          <NodeTransformer
            ref={transformerRef}
            transformerConfig={{ keepRatio: false }}
          />
        )}
      </>
    );
  },
);

EllipseDrawable.displayName = 'EllipseDrawable';

export default EllipseDrawable;

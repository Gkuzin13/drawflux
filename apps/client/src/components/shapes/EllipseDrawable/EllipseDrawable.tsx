import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback } from 'react';
import { Ellipse } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvasSlice';

const EllipseDrawable = memo(
  ({
    node,
    selected,
    draggable,
    onNodeChange,
    onPress,
  }: NodeComponentProps) => {
    const { nodeRef, transformerRef } = useTransformer<Konva.Ellipse>([
      selected,
    ]);

    const { stageConfig } = useAppSelector(selectCanvas);

    const { totalDashLength, config } = useNode(node, stageConfig);

    useAnimatedLine({
      enabled: node.style.animated,
      elementRef: nodeRef,
      totalDashLength,
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

    const handleTransformEnd = useCallback(
      (event: KonvaEventObject<Event>) => {
        const ellipse = event.target as Konva.Ellipse;

        const radiusX = (ellipse.width() * ellipse.scaleX()) / 2;
        const radiusY = (ellipse.height() * ellipse.scaleY()) / 2;

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

        ellipse.scale({ x: 1, y: 1 });
      },
      [node, onNodeChange],
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
          onTransformEnd={handleTransformEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        />
        {selected && <NodeTransformer ref={transformerRef} />}
      </>
    );
  },
);

EllipseDrawable.displayName = 'EllipseDrawable';

export default EllipseDrawable;

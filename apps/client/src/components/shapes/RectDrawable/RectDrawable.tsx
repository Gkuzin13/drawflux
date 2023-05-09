import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback } from 'react';
import { Rect } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvasSlice';

const RectDrawable = memo(
  ({
    node,
    selected,
    draggable,
    onNodeChange,
    onPress,
  }: NodeComponentProps) => {
    const { nodeRef, transformerRef } = useTransformer<Konva.Rect>([selected]);

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
        if (!event.target) return;

        const rect = event.target as Konva.Rect;

        const scaleX = rect.scaleX();
        const scaleY = rect.scaleY();

        rect.scaleX(1);
        rect.scaleY(1);

        onNodeChange({
          ...node,
          nodeProps: {
            ...node.nodeProps,
            point: [rect.x(), rect.y()],
            width: Math.max(5, rect.width() * scaleX),
            height: Math.max(rect.height() * scaleY),
            rotation: rect.rotation(),
          },
        });
      },
      [node, onNodeChange],
    );

    return (
      <>
        <Rect
          ref={nodeRef}
          x={node.nodeProps.point[0]}
          y={node.nodeProps.point[1]}
          width={node.nodeProps.width}
          height={node.nodeProps.height}
          cornerRadius={8}
          {...config}
          draggable={draggable}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        />
        {selected && (
          <NodeTransformer
            ref={transformerRef}
            transformerConfig={{ id: node.nodeProps.id }}
          />
        )}
      </>
    );
  },
);

RectDrawable.displayName = 'RectDrawable';

export default RectDrawable;

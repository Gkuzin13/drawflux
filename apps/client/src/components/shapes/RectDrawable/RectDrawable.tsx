import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useMemo } from 'react';
import { Rect } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import { createDefaultNodeConfig } from '@/constants/element';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useTransformer from '@/hooks/useTransformer';

const RectDrawable = memo(
  ({
    node,
    selected,
    draggable,
    onNodeChange,
    onPress,
  }: Omit<NodeComponentProps, 'text'>) => {
    const { nodeRef, transformerRef } = useTransformer<Konva.Rect>([selected]);

    const { nodeProps, style } = node;

    useAnimatedLine(
      nodeRef.current,
      style.line[0] + style.line[1],
      style.animated,
      style.line,
    );

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        visible: nodeProps.visible,
        id: nodeProps.id,
        rotation: nodeProps.rotation,
        strokeWidth: style.size,
        stroke: style.color,
        opacity: style.opacity,
        dash: style.line,
        draggable,
      });
    }, [style, nodeProps.id, nodeProps.rotation, nodeProps.visible, draggable]);

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
          x={nodeProps.point[0]}
          y={nodeProps.point[1]}
          width={nodeProps.width}
          height={nodeProps.height}
          cornerRadius={8}
          {...config}
          onDragStart={() => onPress(node.nodeProps.id)}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        />
        {selected && (
          <NodeTransformer
            ref={transformerRef}
            transformerConfig={{ id: nodeProps.id }}
          />
        )}
      </>
    );
  },
);

RectDrawable.displayName = 'RectDrawable';

export default RectDrawable;

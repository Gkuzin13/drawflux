import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useMemo } from 'react';
import { Ellipse } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import { createDefaultNodeConfig } from '@/constants/element';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useTransformer from '@/hooks/useTransformer';

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

    useAnimatedLine(
      nodeRef.current,
      node.style.line[0] + node.style.line[1],
      node.style.animated,
      node.style.line,
    );

    const { nodeProps, style } = node;

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        visible: nodeProps.visible,
        id: nodeProps.id,
        rotation: nodeProps.rotation,
        stroke: style.color,
        strokeWidth: style.size,
        opacity: style.opacity,
        dash: style.line,
        draggable,
      });
    }, [nodeProps.visible, nodeProps.id, nodeProps.rotation, style, draggable]);

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
          onDragStart={() => onPress(node.nodeProps.id)}
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

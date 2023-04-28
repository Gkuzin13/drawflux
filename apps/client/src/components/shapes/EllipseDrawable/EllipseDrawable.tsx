import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useMemo } from 'react';
import { Ellipse } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import NodeTransformer from '@/components/NodeTransformer';
import { createDefaultNodeConfig } from '@/constants/element';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectStageConfig } from '@/stores/slices/stageConfigSlice';

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

    const { scale: stageScale } = useAppSelector(selectStageConfig);

    const scaledLine = useMemo(() => {
      return node.style.line.map((l) => l * stageScale);
    }, [node.style.line, stageScale]);

    useAnimatedLine(
      nodeRef.current,
      scaledLine[0] + scaledLine[1],
      node.style.animated,
      node.style.line,
    );

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        visible: node.nodeProps.visible,
        id: node.nodeProps.id,
        rotation: node.nodeProps.rotation,
        stroke: node.style.color,
        strokeWidth: node.style.size * stageScale,
        opacity: node.style.opacity,
        dash: scaledLine,
        draggable,
      });
    }, [node.nodeProps, node.style, draggable, scaledLine, stageScale]);

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

EllipseDrawable.displayName = 'EllipseDrawable';

export default EllipseDrawable;

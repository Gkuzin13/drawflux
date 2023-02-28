import {
  createDefaultNodeConfig,
  getStyleValues,
} from '@/client/shared/element';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import useTransformer from '@/client/shared/hooks/useTransformer';
import Konva from 'konva';
import { RefObject } from 'react';
import { Ellipse } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import type { NodeComponentProps } from '../types';

const CircleDrawable = ({
  node,
  selected,
  draggable,
  onNodeChange,
  onSelect,
}: NodeComponentProps) => {
  const { dash, strokeWidth } = getStyleValues(node.style);

  const { nodeRef, transformerRef } = useTransformer<Konva.Ellipse>(selected);

  useAnimatedLine(
    nodeRef.current,
    dash[0] + dash[1],
    node.style.animated,
    node.style.line,
  );

  const { nodeProps, style } = node;

  const config = createDefaultNodeConfig({
    visible: nodeProps.visible,
    strokeWidth,
    stroke: style.color,
    id: nodeProps.id,
    rotation: nodeProps.rotation,
    draggable,
    dash,
  });

  return (
    <>
      <Ellipse
        ref={nodeRef}
        radiusX={node.nodeProps.width || 0}
        radiusY={node.nodeProps.height || 0}
        x={node.nodeProps.point[0]}
        y={node.nodeProps.point[1]}
        {...config}
        onDragStart={onSelect}
        onDragEnd={(event) => {
          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: [event.target.x(), event.target.y()],
            },
          });
        }}
        onTransformEnd={(event) => {
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
            },
          });

          ellipse.scale({ x: 1, y: 1 });
        }}
        onTap={onSelect}
        onClick={onSelect}
      />
      {selected && <NodeTransformer ref={transformerRef} />}
    </>
  );
};

export default CircleDrawable;

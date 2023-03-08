import {
  createDefaultNodeConfig,
  getStyleValues,
} from '@/client/shared/element';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import useTransformer from '@/client/shared/hooks/useTransformer';
import Konva from 'konva';
import { Rect } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import type { NodeComponentProps } from '../types';

const RectDrawable = ({
  node,
  selected,
  draggable,
  onNodeChange,
  onPress,
}: Omit<NodeComponentProps, 'text'>) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Rect>([selected]);

  const { dash, strokeWidth } = getStyleValues(node.style);

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
    opacity: style.opacity,
    draggable,
    dash,
  });
  console.log('rect render');
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
        onDragEnd={(event) => {
          onNodeChange({
            ...node,
            nodeProps: {
              ...nodeProps,
              point: [event.target.x(), event.target.y()],
            },
          });
        }}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const rect = event.target as Konva.Rect;

          const scaleX = rect.scaleX();
          const scaleY = rect.scaleY();

          rect.scaleX(1);
          rect.scaleY(1);

          onNodeChange({
            ...node,
            nodeProps: {
              ...nodeProps,
              point: [rect.x(), rect.y()],
              width: Math.max(5, rect.width() * scaleX),
              height: Math.max(rect.height() * scaleY),
            },
          });
        }}
        onTap={() => onPress(node.nodeProps.id)}
        onClick={() => onPress(node.nodeProps.id)}
      />
      {selected && <NodeTransformer ref={transformerRef} />}
    </>
  );
};

export default RectDrawable;

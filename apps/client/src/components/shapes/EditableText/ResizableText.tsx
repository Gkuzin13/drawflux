import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
import { Text } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import { createDefaultNodeConfig } from '@/constants/element';
import useTransformer from '@/hooks/useTransformer';
import NodeTransformer from '../../NodeTransformer';

type Props = {
  onDoubleClick: () => void;
} & NodeComponentProps;

const ResizableText = ({
  node,
  draggable,
  selected,
  onNodeChange,
  onPress,
  onDoubleClick,
}: Props) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Text>([selected]);

  const config = useMemo(() => {
    return createDefaultNodeConfig({
      visible: node.nodeProps.visible,
      fill: node.style.color,
      id: node.nodeProps.id,
      rotation: node.nodeProps.rotation,
      fillEnabled: true,
      opacity: node.style.opacity,
      strokeWidth: 0,
      draggable,
      fontSize: node.style.size * 8,
      height: node.nodeProps.height,
      width: node.nodeProps.width,
    });
  }, [node.nodeProps, node.style, draggable]);

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

  const handleTransform = useCallback((event: KonvaEventObject<Event>) => {
    const textNode = event.target as Konva.Text;

    textNode.width(getNodeSize(textNode.width(), textNode.scaleX()));
    textNode.scale({ x: 1, y: 1 });
  }, []);

  const handleTransformEnd = useCallback(
    (event: KonvaEventObject<Event>) => {
      const textNode = event.target as Konva.Text;

      onNodeChange({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          point: [textNode.x(), textNode.y()],
          width: getNodeSize(textNode.width(), textNode.scaleX()),
          rotation: textNode.rotation(),
        },
      });

      textNode.scale({ x: 1, y: 1 });
    },
    [node, onNodeChange],
  );

  function getNodeSize(width: number, scale: number, min = 20) {
    return Math.max(width * scale, min);
  }

  return (
    <>
      <Text
        ref={nodeRef}
        x={node.nodeProps.point[0]}
        y={node.nodeProps.point[1]}
        text={node.text || ''}
        lineHeight={1.5}
        {...config}
        onDragStart={() => onPress(node.nodeProps.id)}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        onTap={() => onPress(node.nodeProps.id)}
        onClick={() => onPress(node.nodeProps.id)}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          transformerConfig={{
            id: node.nodeProps.id,
            enabledAnchors: ['middle-left', 'middle-right'],
          }}
          transformerEvents={{
            onDblClick: onDoubleClick,
            onDblTap: onDoubleClick,
          }}
        />
      )}
    </>
  );
};

export default ResizableText;

import type Konva from 'konva';
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

  const { nodeProps, style } = node;

  const config = createDefaultNodeConfig({
    visible: nodeProps.visible,
    fill: style.color,
    id: nodeProps.id,
    rotation: nodeProps.rotation,
    fillEnabled: true,
    opacity: style.opacity,
    strokeWidth: 0,
    draggable,
    fontSize: style.size * 8,
    height: nodeProps.height,
    width: nodeProps.width,
  });

  function getNodeSize(width: number, scale: number, min = 20) {
    return Math.max(width * scale, min);
  }

  return (
    <>
      <Text
        ref={nodeRef}
        x={nodeProps.point[0]}
        y={nodeProps.point[1]}
        text={node.text || ''}
        lineHeight={1.5}
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
        onTransform={(event) => {
          const textNode = event.target as Konva.Text;

          textNode.width(getNodeSize(textNode.width(), textNode.scaleX()));
          textNode.scale({ x: 1, y: 1 });
        }}
        onTransformEnd={(event) => {
          const textNode = event.target as Konva.Text;

          onNodeChange({
            ...node,
            nodeProps: {
              ...nodeProps,
              point: [textNode.x(), textNode.y()],
              width: getNodeSize(textNode.width(), textNode.scaleX()),
              rotation: textNode.rotation(),
            },
          });

          textNode.scale({ x: 1, y: 1 });
        }}
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

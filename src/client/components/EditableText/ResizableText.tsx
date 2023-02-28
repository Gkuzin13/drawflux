import { createDefaultNodeConfig } from '@/client/shared/element';
import useTransformer from '@/client/shared/hooks/useTransformer';
import Konva from 'konva';
import { Text } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import { NodeComponentProps } from '../types';

type Props = {
  onDoubleClick: () => void;
} & NodeComponentProps;

const ResizableText = ({
  node,
  draggable,
  selected,
  onNodeChange,
  onSelect,
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
  });

  function getNodeWidth(width: number, scale: number) {
    return Math.max(width * scale, 20);
  }

  return (
    <>
      <Text
        ref={nodeRef}
        x={nodeProps.point[0]}
        y={nodeProps.point[1]}
        fontSize={style.fontSize || 16}
        text={node.text || ''}
        {...config}
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

          textNode.width(getNodeWidth(textNode.width(), textNode.scaleX()));
          textNode.scale({ x: 1, y: 1 });
        }}
        onTransformEnd={(event) => {
          const textNode = event.target as Konva.Text;

          onNodeChange({
            ...node,
            nodeProps: {
              ...nodeProps,
              width: getNodeWidth(textNode.width(), textNode.scaleX()),
              rotation: textNode.rotation(),
            },
          });

          textNode.scale({ x: 1, y: 1 });
        }}
        onTap={onSelect}
        onClick={onSelect}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          transformerConfig={{
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

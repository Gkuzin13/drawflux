import { useCallback } from 'react';
import { Text } from 'react-konva';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import NodeTransformer from '../../Transformer/NodeTransformer';
import { TEXT } from '@/constants/shape';
import { getNodeSize } from './helpers/size';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import type Konva from 'konva';

type Props = NodeComponentProps<'text'>;

const ResizableText = ({ node, selected, stageScale, onNodeChange }: Props) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Text>([selected]);

  const { config } = useNode(node, stageScale);

  const handleDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
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

  const handleTransform = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const textNode = event.target as Konva.Text;

      textNode.width(getNodeSize(textNode.width(), textNode.scaleX()));
      textNode.scale({ x: 1, y: 1 });
    },
    [],
  );

  const handleTransformEnd = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const textNode = event.target as Konva.Text;
      const joinedText = textNode.textArr.map(({ text }) => text).join('\n');

      onNodeChange({
        ...node,
        text: joinedText,
        nodeProps: {
          ...node.nodeProps,
          point: [textNode.x(), textNode.y()],
          width: getNodeSize(textNode.width(), textNode.scaleX()),
          height: getNodeSize(textNode.height(), textNode.scaleY()),
          rotation: textNode.rotation(),
        },
      });

      textNode.scale({ x: 1, y: 1 });
    },
    [node, onNodeChange],
  );

  return (
    <>
      <Text
        ref={nodeRef}
        x={node.nodeProps.point[0]}
        y={node.nodeProps.point[1]}
        text={node.text ?? ''}
        lineHeight={TEXT.LINE_HEIGHT}
        padding={TEXT.PADDING}
        fontStyle={TEXT.FONT_WEIGHT}
        {...config}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          stageScale={stageScale}
          transformerConfig={{
            enabledAnchors: ['middle-left', 'middle-right'],
            type: TEXT.TRANSFORMER_TYPE,
          }}
        />
      )}
    </>
  );
};

export default ResizableText;

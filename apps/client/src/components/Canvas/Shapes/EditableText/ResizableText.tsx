import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback } from 'react';
import { Text } from 'react-konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import { getColorValue, getSizeValue } from '@/utils/shape';
import NodeTransformer from '../../Transformer/NodeTransformer';
import { getFontSize } from './helpers/font';
import { TEXT } from '@/constants/shape';
import { getNodeSize } from './helpers/size';

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

  const { stageConfig } = useAppSelector(selectCanvas);

  const { config } = useNode(node, stageConfig, {
    fillEnabled: true,
    strokeWidth: 0,
    fontSize: getFontSize(getSizeValue(node.style.size)),
    fill: getColorValue(node.style.color),
    fontFamily: TEXT.FONT_FAMILY,
    dash: [],
  });

  const handleOnPress = useCallback(() => {
    onPress(node.nodeProps.id);
  }, [node, onPress]);

  const handleDragEnd = useCallback(
    (event: KonvaEventObject<DragEvent>) => {
      onNodeChange({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          point: [event.target.x(), event.target.y()],
        },
      });
      handleOnPress();
    },
    [node, onNodeChange, handleOnPress],
  );

  const handleTransform = useCallback((event: KonvaEventObject<Event>) => {
    const textNode = event.target as Konva.Text;

    textNode.width(getNodeSize(textNode.width(), textNode.scaleX()));
    textNode.scale({ x: 1, y: 1 });
  }, []);

  const handleTransformEnd = useCallback(
    (event: KonvaEventObject<Event>) => {
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
        draggable={draggable}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        onTap={handleOnPress}
        onClick={handleOnPress}
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

import { useCallback } from 'react';
import { Text } from 'react-konva';
import useNode from '@/hooks/useNode/useNode';
import { TEXT } from '@/constants/shape';
import { getNodeSize } from './helpers/size';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import type Konva from 'konva';

type Props = NodeComponentProps<'text'>;

const ResizableText = ({ node, stageScale }: Props) => {
  const { config } = useNode(node, stageScale);

  const handleTransform = useCallback(
    (event: Konva.KonvaEventObject<Event>) => {
      const textNode = event.target as Konva.Text;

      textNode.width(getNodeSize(textNode.width(), textNode.scaleX()));
      textNode.scale({ x: 1, y: 1 });
    },
    [],
  );

  return (
    <Text
      x={node.nodeProps.point[0]}
      y={node.nodeProps.point[1]}
      text={node.text ?? ''}
      lineHeight={TEXT.LINE_HEIGHT}
      padding={TEXT.PADDING}
      fontStyle={TEXT.FONT_WEIGHT}
      name={TEXT.NAME}
      {...config}
      onTransform={handleTransform}
    />
  );
};

export default ResizableText;

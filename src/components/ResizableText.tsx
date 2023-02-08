import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRef } from 'react';
import { Text } from 'react-konva';
import NodeContainer from './NodeContainer';
import { NodeComponentProps } from './types';

type Props = {
  onDoubleClick: () => void;
} & NodeComponentProps;

const ResizableText = ({
  nodeProps,
  text,
  isSelected,
  type,
  onNodeChange,
  onSelect,
  onDoubleClick,
  onContextMenu,
}: Props) => {
  const textRef = useRef<Konva.Text>(null);

  const handleResize = () => {
    if (textRef.current) {
      const textNode = textRef.current;
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();

      textNode.setAttrs({
        width: newWidth,
        scaleX: 1,
      });

      onNodeChange({
        nodeProps: { ...nodeProps, width: newWidth, height: newHeight },
        text,
        type,
      });
    }
  };

  return (
    <NodeContainer
      type={type}
      text={text}
      isSelected={isSelected}
      nodeProps={nodeProps}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
      transformerEvents={{ onDblClick: onDoubleClick, onDblTap: onDoubleClick }}
      transformerConfig={{
        enabledAnchors: [],
        boundBoxFunc: (oldBox, newBox) => {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        },
      }}
    >
      <Text
        {...nodeProps}
        text={text}
        fontSize={16}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        onTransformEnd={(e: KonvaEventObject<Event>) => {
          if (!e.target) return;

          const node = e.target as Konva.Rect;

          onNodeChange({
            type,
            text,
            nodeProps: {
              ...nodeProps,
              rotation: node.rotation(),
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default ResizableText;

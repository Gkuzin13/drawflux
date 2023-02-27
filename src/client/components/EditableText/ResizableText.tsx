import Konva from 'konva';
import { useRef } from 'react';
import { Text } from 'react-konva';
import NodeContainer from '../NodeContainer';
import { NodeComponentProps } from '../types';

type Props = {
  onDoubleClick: () => void;
} & NodeComponentProps;

const ResizableText = ({
  nodeProps,
  onNodeChange,
  onSelect,
  onDoubleClick,
  onContextMenu,
  ...restProps
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
        ...restProps,
      });
    }
  };

  return (
    <NodeContainer
      {...restProps}
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
        x={nodeProps.point[0]}
        y={nodeProps.point[1]}
        text={restProps.text || ''}
        fontSize={16}
        onTransform={handleResize}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const node = event.target as Konva.Rect;

          onNodeChange({
            type: restProps.type,
            text: restProps.text,
            style: restProps.style,
            nodeProps: {
              ...nodeProps,
              point: [node.x(), node.y()],
              rotation: node.rotation(),
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default ResizableText;
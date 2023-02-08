import Konva from 'konva';
import { useRef } from 'react';
import { Text } from 'react-konva';
import NodeContainer from './NodeContainer';
import { DrawableProps } from './types';

type Props = {
  onDoubleClick: () => void;
} & DrawableProps;

const ResizableText = ({
  shapeProps,
  text,
  isSelected,
  type,
  onChange,
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

      onChange({
        shapeProps: { ...shapeProps, width: newWidth, height: newHeight },
        text,
      });
    }
  };

  return (
    <NodeContainer
      isDrawable={false}
      type={type}
      text={text}
      isSelected={isSelected}
      shapeProps={shapeProps}
      onChange={onChange}
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
        {...shapeProps}
        text={text}
        fontSize={16}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
      />
    </NodeContainer>
  );
};

export default ResizableText;

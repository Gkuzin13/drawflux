import { useEffect, useState } from 'react';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import type { KonvaEventObject } from 'konva/lib/Node';

export type OnTextSaveArgs = {
  text: string;
  width: number;
  height: number;
};

const EditableText = ({
  node,
  selected,
  stageScale,
  onNodeChange,
  onTextChange,
}: NodeComponentProps<'text'>) => {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!node.text) {
      setEditing(true);
    }

    return () => {
      setEditing(false);
    };
  }, [node.text]);

  const handleTextSave = ({ text, width, height }: OnTextSaveArgs) => {
    onNodeChange({
      ...node,
      text,
      nodeProps: { ...node.nodeProps, width, height },
    });
    
    setEditing(false);
  };

  const handleTextUpdate = (text: string) => {
    if (onTextChange) {
      onTextChange({ ...node, text });
    }
  };

  const handleDoubleClick = (event: KonvaEventObject<PointerEvent>) => {
    event.evt.stopPropagation();
    setEditing(true);
  };

  if (editing) {
    return (
      <EditableTextInput
        node={node}
        initialValue={node.text ?? ''}
        onChange={handleTextSave}
        onUpdate={handleTextUpdate}
      />
    );
  }

  return (
    <ResizableText
      node={node}
      selected={selected}
      stageScale={stageScale}
      onNodeChange={onNodeChange}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default EditableText;

import { useEffect, useState } from 'react';
import type { NodeComponentProps } from '@/components/Node/Node';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';

export type OnTextSaveArgs = {
  text: string;
  width: number;
};

const EditableText = ({
  node,
  selected,
  draggable,
  onNodeChange,
  onPress,
}: NodeComponentProps) => {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!node.text) {
      setEditing(true);
    }

    return () => {
      setEditing(false);
    };
  }, [node.text]);

  const handleTextSave = ({ text, width }: OnTextSaveArgs) => {
    onNodeChange({
      ...node,
      text,
      nodeProps: {
        ...node.nodeProps,
        width,
      },
    });

    setEditing(false);
  };

  if (editing) {
    return (
      <EditableTextInput
        node={node}
        initialValue={node.text || ''}
        onTextSave={handleTextSave}
      />
    );
  }

  return (
    <ResizableText
      node={node}
      selected={selected}
      draggable={draggable}
      onNodeChange={onNodeChange}
      onPress={onPress}
      onDoubleClick={() => setEditing(true)}
    />
  );
};

export default EditableText;

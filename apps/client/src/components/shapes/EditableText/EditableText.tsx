import React, { type ChangeEvent, useEffect, useState } from 'react';
import type { NodeComponentProps } from '@/components/Node/Node';
import { KEYS } from '@/constants/keys';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';

const EditableText = ({
  node,
  selected,
  draggable,
  onNodeChange,
  onPress,
}: NodeComponentProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.text || '');

  useEffect(() => {
    if (!node.text) {
      setEditing(true);
    }

    return () => {
      setEditing(false);
    };
  }, [node.text]);

  const handleTextSave = () => {
    onNodeChange({
      ...node,
      text: value.length ? value : null,
    });

    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      (event.key === KEYS.ENTER && !event.shiftKey) ||
      event.key === KEYS.ESCAPE
    ) {
      handleTextSave();
    }
  };

  const handleTextChange = (event: ChangeEvent) => {
    const { value } = event.target as HTMLTextAreaElement;

    setValue(value);
  };

  if (editing) {
    return (
      <EditableTextInput
        node={node}
        value={value}
        onTextChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onClickAway={handleTextSave}
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

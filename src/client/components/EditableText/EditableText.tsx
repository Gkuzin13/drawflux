import React, { ChangeEvent, useEffect, useState } from 'react';
import { NodeComponentProps } from '../types';
import EditableTextInput from '../EditableText/EditableTextInput';
import ResizableText from '../EditableText/ResizableText';
import { KEYS } from '@/client/shared/keys';

const EditableText = ({
  node,
  selected,
  draggable,
  onNodeChange,
  onSelect,
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
    if (!value) {
      onNodeChange(null);
    } else {
      onNodeChange({
        ...node,
        text: value,
      });
    }

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
      onSelect={onSelect}
      onDoubleClick={() => setEditing(true)}
    />
  );
};

export default EditableText;

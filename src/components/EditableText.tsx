import React, { ChangeEvent, useEffect, useState } from 'react';
import { NodeComponentProps } from './types';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';
import { KEYS } from '@/shared/keys';

const EditableText = ({
  nodeProps,
  selected,
  draggable,
  text,
  type,
  onNodeChange,
  onSelect,
  onContextMenu,
}: NodeComponentProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text || '');

  useEffect(() => {
    if (!text) {
      setEditing(true);
    }
  }, []);

  const onDoubleClick = () => {
    setEditing(true);
  };

  const handleTextSave = () => {
    if (!value.length) {
      onNodeChange(null);
    } else {
      onNodeChange({
        nodeProps,
        text: value,
        type,
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

    setValue(() => value);
  };

  if (editing) {
    return (
      <EditableTextInput
        nodeProps={nodeProps}
        value={value}
        onTextChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onClickAway={handleTextSave}
      />
    );
  }

  return (
    <ResizableText
      nodeProps={nodeProps}
      selected={selected}
      draggable={draggable}
      text={value}
      type={type}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    />
  );
};

export default EditableText;

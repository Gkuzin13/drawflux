import React, { ChangeEvent, useEffect, useState } from 'react';
import { NodeComponentProps } from '../types';
import EditableTextInput from '../EditableText/EditableTextInput';
import ResizableText from '../EditableText/ResizableText';
import { KEYS } from '@/client/shared/keys';

const EditableText = ({
  nodeProps,
  text,
  selected,
  type,
  style,
  draggable,
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

    return () => {
      setEditing(false);
    };
  }, [text]);

  const onDoubleClick = () => {
    setEditing(true);
  };

  const handleTextSave = () => {
    if (!value) {
      onNodeChange(null);
    } else {
      onNodeChange({
        nodeProps,
        style,
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

    setValue(value);
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
      style={style}
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

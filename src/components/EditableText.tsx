import { useClickAway } from '@/shared/hooks/useClickAway';
import Konva from 'konva';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import ShapeDrawable from './ShapeDrawable';
import { DrawableProps } from './types';
import { ENTER_KEY, ESCAPE_KEY } from '@/shared/constants/event-keys';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';

const textareaStaticStyles: React.CSSProperties = {
  position: 'absolute',
  border: 'none',
  padding: '0px',
  margin: '0px',
  overflow: 'hidden',
  background: 'none',
  outline: 'none',
  resize: 'none',
  transformOrigin: 'left top',
};

const EditableText = ({
  shapeProps,
  isSelected,
  text,
  type,
  onChange,
  onSelect,
}: DrawableProps) => {
  const [editing, setEditing] = useState(true);
  const [value, setValue] = useState(text);

  useEffect(() => {
    if (!isSelected && editing) {
      setEditing(false);
    }
  }, [isSelected, editing]);

  const handleEscapeKeys = (e: any) => {
    if ((e.key === ENTER_KEY && !e.shiftKey) || e.key === ESCAPE_KEY) {
      setEditing(false);

      const { value } = e.target as HTMLTextAreaElement;

      onChange({
        shapeProps,
        text: value,
      });
    }
  };

  const handleTextChange = (e: any) => {
    const { value } = e.target as HTMLTextAreaElement;
    setValue(() => value);
    console.log(value);
  };

  if (editing) {
    return (
      <EditableTextInput
        width={shapeProps.width!}
        height={shapeProps.height!}
        x={shapeProps.x}
        y={shapeProps.y}
        value={value}
        onTextChange={handleTextChange}
        onKeyDown={handleEscapeKeys}
      />
    );
  }

  return (
    <ResizableText
      shapeProps={shapeProps}
      isSelected={isSelected}
      text={value}
      type={type}
      onChange={onChange}
      isDrawable={false}
      onSelect={onSelect}
      onDoubleClick={() => setEditing(true)}
    />
  );
};

export default EditableText;

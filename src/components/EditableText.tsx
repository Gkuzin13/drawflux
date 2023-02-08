import { useEffect, useState } from 'react';
import { DrawableProps } from './types';
import { ENTER_KEY, ESCAPE_KEY } from '@/shared/constants/event-keys';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';

const EditableText = ({
  shapeProps,
  isSelected,
  text,
  type,
  onChange,
  onSelect,
  onContextMenu,
}: DrawableProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    if (!text?.length) {
      setEditing(true);
    }
  }, [text]);

  const handleTextSave = () => {
    setEditing(false);

    onChange({
      shapeProps,
      text: value,
    });
  };

  const handleEscapeKeys = (e: any) => {
    if ((e.key === ENTER_KEY && !e.shiftKey) || e.key === ESCAPE_KEY) {
      handleTextSave();
    }
  };

  const handleTextChange = (e: any) => {
    const { value } = e.target as HTMLTextAreaElement;
    setValue(() => value);
  };

  if (editing) {
    return (
      <EditableTextInput
        width={shapeProps.width!}
        height={shapeProps.height!}
        x={shapeProps.x}
        y={shapeProps.y}
        value={value || ''}
        onTextChange={handleTextChange}
        onKeyDown={handleEscapeKeys}
        onClickAway={handleTextSave}
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
      onContextMenu={onContextMenu}
    />
  );
};

export default EditableText;

import { useEffect, useLayoutEffect, useState } from 'react';
import { NodeComponentProps } from './types';
import { ENTER_KEY, ESCAPE_KEY } from '@/shared/constants/event-keys';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';

const EditableText = ({
  nodeProps,
  isSelected,
  text,
  type,
  onNodeChange,
  onSelect,
  onContextMenu,
}: NodeComponentProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    if (!text) {
      setEditing(true);
    }
  }, []);

  const onDoubleClick = () => {
    setEditing(true);
  };

  const handleTextSave = () => {
    onNodeChange({
      nodeProps,
      text: value,
      type,
    });

    setEditing(false);
  };

  const handleKeyDown = (e: any) => {
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
        nodeProps={nodeProps}
        value={value || ''}
        onTextChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onClickAway={handleTextSave}
      />
    );
  }

  return (
    <ResizableText
      nodeProps={nodeProps}
      isSelected={isSelected}
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

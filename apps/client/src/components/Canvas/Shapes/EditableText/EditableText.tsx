import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

export type OnTextSaveArgs = {
  text: string;
  width: number;
  height: number;
};

const EditableText = ({
  node,
  selected,
  stageScale,
  editing,
  onNodeChange,
  onTextChange,
}: NodeComponentProps<'text'>) => {
  const handleTextSave = ({ text, width, height }: OnTextSaveArgs) => {
    onNodeChange({
      ...node,
      text,
      nodeProps: { ...node.nodeProps, width, height },
    });
  };

  const handleTextUpdate = (text: string) => {
    if (onTextChange) {
      onTextChange({ ...node, text });
    }
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
    />
  );
};

export default EditableText;

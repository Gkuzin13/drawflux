import { useEffect, useState } from 'react';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import { useWebSocket } from '@/contexts/websocket';
import EditableTextInput from './EditableTextInput';
import ResizableText from './ResizableText';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppSelector } from '@/stores/hooks';
import { selectMyUser } from '@/stores/slices/collaboration';

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
}: NodeComponentProps<'text'>) => {
  const [editing, setEditing] = useState(false);

  const ws = useWebSocket();
  const thisUserId = useAppSelector(selectMyUser);

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
      nodeProps: {
        ...node.nodeProps,
        width,
        height,
      },
    });
    
    setEditing(false);
  };

  const handleTextUpdate = (text: string) => {
    if (ws.isConnected && thisUserId) {
      ws.send({
        type: 'draft-text-update',
        data: { nodeId: node.nodeProps.id, text, userId: thisUserId },
      });
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

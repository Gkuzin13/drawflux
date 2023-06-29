import { useEffect, useState } from 'react';
import type { WSMessage } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import { useWebSocket } from '@/contexts/websocket';
import { sendMessage } from '@/utils/websocket';
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

  const ws = useWebSocket();

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

  const handleTextUpdate = (text: string) => {
    if (ws?.isConnected) {
      const message: WSMessage = {
        type: 'draft-text-update',
        data: { id: node.nodeProps.id, text },
      };

      sendMessage(ws.connection, message);
    }
  };

  if (editing) {
    return (
      <EditableTextInput
        node={node}
        initialValue={node.text || ''}
        onChange={handleTextSave}
        onUpdate={handleTextUpdate}
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

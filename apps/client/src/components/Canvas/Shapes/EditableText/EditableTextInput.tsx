import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { Html } from 'react-konva-utils';
import { type NodeObject } from 'shared';
import { KEYS } from '@/constants/keys';
import { useClickAway } from '@/hooks/useClickAway/useClickAway';
import { getColorValue, getSizeValue } from '@/utils/shape';
import type { OnTextSaveArgs } from './EditableText';
import * as Styled from './EditableTextInput.styled';

type Props = {
  node: NodeObject;
  initialValue: string;
  onChange: (args: OnTextSaveArgs) => void;
  onUpdate: (value: string) => void;
};

const getStyle = (fontSize: number, color: string): React.CSSProperties => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    color,
    fontSize: `${fontSize * 8}px`,
  };

  if (isFirefox) {
    return {
      ...baseStyle,
      marginTop: `-${fontSize / 2 + 1}px`,
    };
  }

  return {
    ...baseStyle,
    marginTop: `-${fontSize / 2}px`,
  };
};

const textSaveKeys = [KEYS.ENTER, KEYS.ESCAPE] as string[];

const EditableTextInput = ({
  node,
  initialValue,
  onChange,
  onUpdate,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, () => handleTextChange(value));

  useEffect(() => {
    if (ref.current) {
      ref.current.setSelectionRange(0, initialValue.length);
      ref.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, initialValue.length]);

  const size = getSizeValue(node.style.size);

  const style = getStyle(size, getColorValue(node.style.color));

  const handleTextChange = (text: string) => {
    if (ref.current) {
      onChange({
        text,
        width: ref.current.scrollWidth + 2,
        height: ref.current.scrollHeight,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();

    if (event.shiftKey) {
      return;
    }

    if (textSaveKeys.includes(event.key) && ref.current) {
      const { value } = ref.current;
      handleTextChange(value);
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    setValue(value);

    onUpdate(value);
  };

  const getTextAreaSize = (text: string) => {
    const lines = text.split('\n');

    return {
      width: `${Math.max(...lines.map((line) => line.length), 1)}ch`,
      rows: lines.length,
    };
  };

  const { width, rows } = getTextAreaSize(value);

  return (
    <Html
      groupProps={{
        x: node.nodeProps.point[0],
        y: node.nodeProps.point[1],
        rotation: node.nodeProps.rotation,
      }}
    >
      <Styled.TextArea
        ref={ref}
        defaultValue={initialValue}
        style={{ ...style, width }}
        rows={rows}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </Html>
  );
};

export default EditableTextInput;

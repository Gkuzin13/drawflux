import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { Html } from 'react-konva-utils';
import type { NodeObject } from 'shared';
import { KEYS } from '@/constants/keys';
import { useClickAway } from '@/hooks/useClickAway/useClickAway';
import { getColorValue, getSizeValue } from '@/utils/shape';
import type { OnTextSaveArgs } from './EditableText';

type Props = {
  node: NodeObject;
  initialValue: string;
  onTextSave: (args: OnTextSaveArgs) => void;
};

const getStyle = (
  width: string,
  height: string,
  fontSize: number,
  color: string,
): React.CSSProperties => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    width,
    height,
    color,
    border: 'none',
    padding: '0px',
    margin: '0px',
    background: 'none',
    lineHeight: 1.5,
    overflow: 'hidden',
    outline: 'none',
    resize: 'none',
    fontFamily: 'sans-serif',
    fontSize: `${fontSize * 8}px`,
  };

  if (isFirefox) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    marginTop: `-${fontSize / 2}px`,
  };
};

const textSaveKeys: string[] = [KEYS.ENTER, KEYS.ESCAPE];

const EditableTextInput = ({ node, initialValue, onTextSave }: Props) => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, () => handleTextChange(value));

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(-1, -1);
    }
  }, [ref.current]);

  const {
    nodeProps: { width, height },
  } = node;

  const size = getSizeValue(node.style.size);

  const style = getStyle(
    width ? `${width}px` : `${Math.max(value.length, 1)}ch`,
    height ? `${height}px` : `${size}`,
    size,
    getColorValue(node.style.color),
  );

  const handleTextChange = (text: string) => {
    if (!ref.current) {
      return;
    }

    const textAreaElement = ref.current;

    onTextSave({
      text,
      width: textAreaElement.offsetWidth,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();

    if (event.shiftKey) {
      return;
    }

    if (textSaveKeys.includes(event.key)) {
      handleTextChange(value);
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target as HTMLTextAreaElement;

    setValue(value);
  };

  return (
    <Html
      groupProps={{
        x: node.nodeProps.point[0],
        y: node.nodeProps.point[1],
        rotation: node.nodeProps.rotation,
      }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        style={style}
      />
    </Html>
  );
};

export default EditableTextInput;

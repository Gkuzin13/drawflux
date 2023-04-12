import type { NodeColor, NodeObject } from '@shared';
import { type ChangeEvent, useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';
import { useClickAway } from '@/hooks/useClickAway';

type Props = {
  node: NodeObject;
  value: string;
  onTextChange: (event: ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onClickAway: () => void;
};

const getStyle = (
  width: string,
  fontSize: number,
  color: NodeColor,
): React.CSSProperties => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    width,
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

const EditableTextInput = ({
  node,
  value,
  onTextChange,
  onKeyDown,
  onClickAway,
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, onClickAway);

  useEffect(() => {
    if (value && ref.current) {
      const end = ref.current.value.length;
      ref.current.setSelectionRange(end, end);
    }
  }, [value]);

  const { nodeProps } = node;

  const style = getStyle(
    nodeProps.width ? `${nodeProps.width}px` : `${Math.max(value.length, 1)}ch`,
    node.style.size,
    node.style.color,
  );

  return (
    <Html
      groupProps={{
        x: nodeProps.point[0],
        y: nodeProps.point[1],
        rotation: nodeProps.rotation,
      }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        style={style}
        autoFocus={true}
      />
    </Html>
  );
};

export default EditableTextInput;

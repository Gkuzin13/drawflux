import { useClickAway } from '@/shared/hooks/useClickAway';
import { useRef } from 'react';
import { Html } from 'react-konva-utils';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  onTextChange: (e: any) => void;
  onKeyDown: (e: any) => void;
  onClickAway: () => void;
};

const getStyle = (
  width: number,
  height: number,
  fontSize: number,
): React.CSSProperties => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    border: 'none',
    padding: '0px',
    margin: '0px',
    background: 'none',
    outline: 'none',
    resize: 'none',
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: `${fontSize}px`,
  };

  if (isFirefox) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    marginTop: '-4px',
  };
};

const EditableTextInput = ({
  x,
  y,
  width,
  height,
  value,
  onTextChange,
  onKeyDown,
  onClickAway,
}: Props) => {
  const style = getStyle(width, height, 16);

  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, onClickAway);

  function onFocus(e: React.FocusEvent) {
    const target = e.target as HTMLTextAreaElement;

    const end = target.value.length;

    target.setSelectionRange(end, end);
    target.focus();
  }

  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        ref={ref}
        autoFocus
        value={value}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        style={style}
      />
    </Html>
  );
};

export default EditableTextInput;

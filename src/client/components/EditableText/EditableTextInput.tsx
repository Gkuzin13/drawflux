import { NodeProps } from '@/client/shared/element';
import { useClickAway } from '@/client/shared/hooks/useClickAway';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';

type Props = {
  nodeProps: NodeProps;
  value: string;
  onTextChange: (event: ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
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
  nodeProps,
  value,
  onTextChange,
  onKeyDown,
  onClickAway,
}: Props) => {
  const style = getStyle(nodeProps.width!, nodeProps.height!, 16);

  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, onClickAway);

  useEffect(() => {
    if (ref.current) {
      onFocus(ref.current);
    }
  }, [ref.current]);

  function onFocus(element: HTMLTextAreaElement) {
    const end = element.value.length;

    element.setSelectionRange(end, end);
    element.focus();
  }

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
        onFocus={({ target }) => onFocus(target)}
        style={style}
      />
    </Html>
  );
};

export default EditableTextInput;

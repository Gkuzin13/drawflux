import { NodeProps } from '@/client/shared/element';
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
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value && ref.current) {
      const end = ref.current.value.length;
      ref.current.setSelectionRange(end, end);
    }
  }, [ref.current]);

  const style = getStyle(nodeProps.width!, nodeProps.height!, 16);

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
        onBlur={onClickAway}
      />
    </Html>
  );
};

export default EditableTextInput;

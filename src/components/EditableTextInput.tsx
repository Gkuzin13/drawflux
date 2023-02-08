import { NodeProps } from '@/shared/constants/base';
import { useClickAway } from '@/shared/hooks/useClickAway';
import { useRef } from 'react';
import { Html } from 'react-konva-utils';

type Props = {
  nodeProps: NodeProps;
  value: string;
  onTextChange: (e: any) => void;
  onKeyDown: (e: any) => void;
  onClickAway: () => void;
  onBlur: () => void;
};

const getStyle = (
  width: number,
  height: number,
  rotation: number,
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
  onBlur,
}: Props) => {
  const style = getStyle(
    nodeProps.width,
    nodeProps.height,
    nodeProps.rotation,
    16,
  );

  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, onClickAway);

  function onFocus(e: React.FocusEvent) {
    const target = e.target as HTMLTextAreaElement;

    const end = target.value.length;

    target.setSelectionRange(end, end);
    target.focus();
  }

  return (
    <Html
      groupProps={{
        x: nodeProps.x,
        y: nodeProps.y,
        width: nodeProps.width,
        height: nodeProps.height,
        rotation: nodeProps.rotation,
      }}
      divProps={{
        style: {
          opacity: 1,
        },
      }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={style}
      />
    </Html>
  );
};

export default EditableTextInput;

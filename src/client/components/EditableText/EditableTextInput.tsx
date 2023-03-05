import { NodeType } from '@/client/shared/element';
import { useClickAway } from '@/client/shared/hooks/useClickAway';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';

type Props = {
  node: NodeType;
  value: string;
  onTextChange: (event: ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onClickAway: () => void;
};

const getStyle = (width: string, fontSize: number): React.CSSProperties => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    width,
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
    marginTop: '-1px',
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
  }, [ref.current, value]);

  const { nodeProps } = node;

  const style = getStyle(
    nodeProps.width ? `${nodeProps.width}px` : 'auto',
    node.style.fontSize || 16,
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

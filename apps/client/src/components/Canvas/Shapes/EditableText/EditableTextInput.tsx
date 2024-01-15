import { useEffect, useState, useMemo } from 'react';
import { Html } from 'react-konva-utils';
import { KEYS } from '@/constants/keys';
import { useClickAway } from '@/hooks/useClickAway/useClickAway';
import { getColorValue, getFontSize, getSizeValue } from '@/utils/shape';
import { getSizePropsFromTextValue } from './helpers/size';
import useDefaultThemeColors from '@/hooks/useThemeColors';
import useAutoFocus from '@/hooks/useAutoFocus/useAutoFocus';
import * as Styled from './EditableTextInput.styled';
import type { NodeObject } from 'shared';
import type { OnTextSaveArgs } from './EditableText';

type Props = {
  node: NodeObject<'text'>;
  initialValue: string;
  onChange: (args: OnTextSaveArgs) => void;
  onUpdate: (value: string) => void;
};

function getStyle(fontSize: number, color: string): React.CSSProperties {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
  };

  if (isFirefox) {
    return {
      ...baseStyle,
      transform: `translateY(-${fontSize / 16}px)`,
    };
  }

  return {
    ...baseStyle,
    transform: `translateY(-${fontSize / 18}px)`,
  };
}

const EditableTextInput = ({
  node,
  initialValue,
  onChange,
  onUpdate,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  const themeColors = useDefaultThemeColors();

  const ref = useAutoFocus<HTMLTextAreaElement>();

  useClickAway(ref, () => handleTextChange(value));

  useEffect(() => {
    if (!ref.current || initialValue.length <= 0) {
      return;
    }
    
    ref.current.setSelectionRange(0, initialValue.length);
  }, [ref, initialValue]);

  const fontSize = useMemo(() => {
    return getFontSize(getSizeValue(node.style.size));
  }, [node.style.size]);

  const style = useMemo(() => {
    return getStyle(fontSize, getColorValue(node.style.color, themeColors));
  }, [fontSize, node.style.color, themeColors]);

  const { width, height } = getSizePropsFromTextValue(value, fontSize);

  const handleTextChange = (text: string) => {
    if (!ref.current) {
      return;
    }

    const { scrollWidth, scrollHeight } = ref.current;

    onChange({ text: text.trim(), width: scrollWidth, height: scrollHeight });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();

    if (event.shiftKey || !ref.current) {
      return;
    }

    const newTextValue = ref.current.value;

    if (event.key === KEYS.ESCAPE) {
      handleTextChange(newTextValue);
    }

    if (event.key === KEYS.ENTER && event.ctrlKey) {
      handleTextChange(newTextValue);
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    setValue(value);
    onUpdate(value);
  };

  const handleOnContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Html
      groupProps={{
        x: node.nodeProps.point[0],
        y: node.nodeProps.point[1],
        rotation: node.nodeProps.rotation,
      }}
      divProps={{ style: { zIndex: 0 } }}
    >
      <Styled.TextArea
        ref={ref}
        defaultValue={initialValue}
        style={{ ...style, width, height }}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        autoFocus
        tabIndex={0}
        autoCapitalize="false"
        autoComplete="false"
        autoSave="false"
        autoCorrect="false"
        wrap="off"
        onContextMenu={handleOnContextMenu}
        data-testid="editable-text-input"
      />
    </Html>
  );
};

export default EditableTextInput;

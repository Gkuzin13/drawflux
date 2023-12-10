import { type ChangeEvent, useEffect, useRef, useState, useMemo } from 'react';
import { Html } from 'react-konva-utils';
import { type NodeObject } from 'shared';
import { KEYS } from '@/constants/keys';
import { useClickAway } from '@/hooks/useClickAway/useClickAway';
import { getColorValue, getFontSize, getSizeValue } from '@/utils/shape';
import type { OnTextSaveArgs } from './EditableText';
import * as Styled from './EditableTextInput.styled';
import { getSizePropsFromTextValue } from './helpers/size';
import useDefaultThemeColors from '@/hooks/useThemeColors';

type Props = {
  node: NodeObject<'text'>;
  initialValue: string;
  onChange: (args: OnTextSaveArgs) => void;
  onUpdate: (value: string) => void;
};

const textSaveKeys = [KEYS.ENTER, KEYS.ESCAPE] as string[];

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

  const ref = useRef<HTMLTextAreaElement>(null);

  useClickAway(ref, () => handleTextChange(value));

  useEffect(() => {
    const element = ref.current;

    if (element) {
      element.focus();

      const textLength = initialValue.length;
      const hasText = textLength > 0;

      hasText && element.setSelectionRange(0, textLength);
    }
  }, [ref, initialValue.length]);

  const fontSize = useMemo(() => {
    return getFontSize(getSizeValue(node.style.size));
  }, [node.style.size]);

  const style = useMemo(() => {
    return getStyle(fontSize, getColorValue(node.style.color, themeColors));
  }, [fontSize, node.style.color, themeColors]);

  const { width, height } = getSizePropsFromTextValue(value, fontSize);

  const handleTextChange = (text: string) => {
    if (ref.current) {
      onChange({
        text,
        width: ref.current.scrollWidth,
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
      handleTextChange(ref.current.value);
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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

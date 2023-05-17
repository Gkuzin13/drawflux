import { useCallback, useMemo } from 'react';
import type { NodeColor, NodeLine, NodeStyle } from 'shared';
import { ICON_SIZES } from '@/constants/icon';
import { ANIMATED, COLOR, LINE, SIZE } from '@/constants/style';
import { capitalizeFirstLetter } from '@/utils/string';
import {
  ColorButton,
  StyleButton,
  StyleContainer,
  StyleGrid,
  StyleRadioGroup,
  ToggleButton,
  StyleLabel,
} from './StylePanelStyled';

export type StylePanelProps = {
  style: Partial<NodeStyle>;
  enabledOptions: {
    line: boolean;
    size: boolean;
  };
  onStyleChange: (updatedStyle: Partial<NodeStyle>) => void;
};

const StylePanel = ({
  style,
  enabledOptions,
  onStyleChange,
}: StylePanelProps) => {
  const handleColorSelect = (color: NodeColor) => {
    onStyleChange({ color });
  };

  const handleLineSelect = (lineName: (typeof LINE)[number]['name']) => {
    const value = LINE.find((l) => l.name === lineName)?.value;

    onStyleChange({
      animated: style.animated && lineName !== 'solid' ? true : false,
      line: value as NodeLine,
    });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !style.animated });
  };

  const handleSizeSelect = (sizeName: (typeof SIZE)[number]['name']) => {
    const value = SIZE.find((s) => s.name === sizeName)?.value;

    onStyleChange({ size: value });
  };

  const isLineStyleActive = useCallback(
    (value: Readonly<NodeLine>) => {
      return style.line
        ? value.every((line, index) => line === style.line?.[index])
        : false;
    },
    [style.line],
  );

  const animatedStyleDisabled = useMemo(() => {
    return style.line ? style.line.every((l) => l === 0) : false;
  }, [style.line]);

  return (
    <StyleContainer>
      <StyleRadioGroup
        defaultValue={style.color}
        aria-label="Color"
        aria-labelledby="shape-color"
        orientation="horizontal"
        onValueChange={handleColorSelect}
      >
        <StyleLabel htmlFor="shape-color" css={{ fontSize: '$1' }}>
          Color
        </StyleLabel>
        <StyleGrid>
          {COLOR.map((color) => {
            return (
              <ColorButton
                key={color.value}
                id={color.value}
                title={capitalizeFirstLetter(color.name)}
                value={color.value}
                checked={color.value === style.color}
                color={
                  color.value === style.color ? 'secondary' : 'secondary-light'
                }
                style={{ color: color.value }}
              />
            );
          })}
        </StyleGrid>
      </StyleRadioGroup>
      {enabledOptions.line && (
        <StyleRadioGroup
          aria-label="Line"
          aria-labelledby="shape-line"
          orientation="horizontal"
          onValueChange={handleLineSelect}
        >
          <StyleLabel htmlFor="shape-line" css={{ fontSize: '$1' }}>
            Line
          </StyleLabel>
          <StyleGrid>
            {LINE.map((line) => {
              return (
                <StyleButton
                  key={line.name}
                  id={line.name}
                  value={line.name}
                  title={capitalizeFirstLetter(line.name)}
                  checked={isLineStyleActive(line.value)}
                  color={
                    isLineStyleActive(line.value)
                      ? 'secondary'
                      : 'secondary-light'
                  }
                >
                  {line.icon({ size: ICON_SIZES.LARGE })}
                </StyleButton>
              );
            })}
          </StyleGrid>
        </StyleRadioGroup>
      )}
      <div aria-labelledby="shape-animated">
        <StyleLabel htmlFor="shape-animated" css={{ fontSize: '$1' }}>
          Animated
        </StyleLabel>
        <ToggleButton
          aria-label="Toggle Animated"
          title={capitalizeFirstLetter(ANIMATED.value)}
          pressed={style.animated}
          color={style.animated ? 'primary' : 'secondary-light'}
          disabled={animatedStyleDisabled}
          onPressedChange={handleAnimatedSelect}
        >
          {style.animated ? 'On' : 'Off'}
        </ToggleButton>
      </div>
      {enabledOptions.size && (
        <StyleRadioGroup
          aria-label="Size"
          aria-labelledby="shape-size"
          orientation="horizontal"
          onValueChange={handleSizeSelect}
        >
          <StyleLabel htmlFor="shape-size" css={{ fontSize: '$1' }}>
            Size
          </StyleLabel>
          <StyleGrid>
            {SIZE.map((size) => {
              return (
                <StyleButton
                  key={size.name}
                  title={capitalizeFirstLetter(size.name)}
                  value={size.name}
                  checked={size.value === style?.size}
                  color={
                    size.value === style?.size ? 'secondary' : 'secondary-light'
                  }
                >
                  {size.icon({ size: ICON_SIZES.LARGE, lineSize: size.value })}
                </StyleButton>
              );
            })}
          </StyleGrid>
        </StyleRadioGroup>
      )}
    </StyleContainer>
  );
};

export default StylePanel;

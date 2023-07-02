import type { NodeColor, NodeStyle } from 'shared';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import Slider from '@/components/Elements/Slider/Slider';
import { ICON_SIZES } from '@/constants/icon';
import { ANIMATED, LINE, OPACITY, SIZE } from '@/constants/panels/style';
import { clamp } from '@/utils/math';
import * as Styled from './StylePanel.styled';

export type StylePanelProps = {
  active: boolean;
  style: Partial<NodeStyle>;
  enabledOptions: {
    line: boolean;
    size: boolean;
  };
  onStyleChange: (updatedStyle: Partial<NodeStyle>) => void;
};

const StylePanel = ({
  active,
  style,
  enabledOptions,
  onStyleChange,
}: StylePanelProps) => {
  const handleColorSelect = (color: NodeColor) => {
    onStyleChange({ color });
  };

  const handleLineSelect = (value: (typeof LINE)[number]['value']) => {
    onStyleChange({
      animated: style.animated && value !== 'solid' ? true : false,
      line: value,
    });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !style.animated });
  };

  const handleSizeSelect = (sizeName: (typeof SIZE)[number]['name']) => {
    const value = SIZE.find((s) => s.name === sizeName)?.value;

    onStyleChange({ size: value });
  };

  const handleOpacityChange = (value: number) => {
    const clampedOpacity = clamp(value, OPACITY.minValue, OPACITY.maxValue);
    onStyleChange({ opacity: clampedOpacity });
  };

  return (
    <Styled.Container active={active}>
      <Styled.InnerContainer
        defaultValue={style.color}
        aria-label="Color"
        aria-labelledby="shape-color"
        orientation="horizontal"
        value={style.color}
        onValueChange={handleColorSelect}
      >
        <Styled.Label htmlFor="shape-color" css={{ fontSize: '$1' }}>
          Color
        </Styled.Label>
        <ColorsGrid value={style.color || ''} onSelect={handleColorSelect} />
      </Styled.InnerContainer>
      <div aria-labelledby="Opacity">
        <Styled.Label css={{ fontSize: '$1' }}>Opacity</Styled.Label>
        <Slider
          value={[style.opacity ?? OPACITY.maxValue]}
          min={OPACITY.minValue}
          max={OPACITY.maxValue}
          step={OPACITY.step}
          label="Opacity"
          onValueChange={(values) => handleOpacityChange(values[0])}
        />
      </div>
      {enabledOptions.line && (
        <>
          <Styled.InnerContainer
            aria-label="Line"
            aria-labelledby="shape-line"
            orientation="horizontal"
            value={style.line}
            onValueChange={handleLineSelect}
          >
            <Styled.Label htmlFor="shape-line" css={{ fontSize: '$1' }}>
              Line
            </Styled.Label>
            <Styled.Grid>
              {LINE.map((line) => {
                return (
                  <Styled.Item
                    aria-label="Select Line"
                    key={line.value}
                    value={line.value}
                    title={line.name}
                    checked={line.value === style.line}
                    color={
                      line.value === style.line
                        ? 'secondary'
                        : 'secondary-light'
                    }
                  >
                    {line.icon({ size: ICON_SIZES.LARGE })}
                  </Styled.Item>
                );
              })}
            </Styled.Grid>
          </Styled.InnerContainer>
          <div aria-labelledby="shape-animated">
            <Styled.Label htmlFor="shape-animated" css={{ fontSize: '$1' }}>
              Animated
            </Styled.Label>
            <Styled.Toggle
              aria-label="Toggle Animated"
              title={ANIMATED.name}
              pressed={style.animated}
              color={style.animated ? 'primary' : 'secondary-light'}
              disabled={style.line === 'solid'}
              onPressedChange={handleAnimatedSelect}
            >
              {style.animated ? 'On' : 'Off'}
            </Styled.Toggle>
          </div>
        </>
      )}
      {enabledOptions.size && (
        <Styled.InnerContainer
          aria-label="Size"
          aria-labelledby="shape-size"
          orientation="horizontal"
          value={SIZE.find((size) => size.value === style.size)?.name}
          onValueChange={handleSizeSelect}
        >
          <Styled.Label htmlFor="shape-size" css={{ fontSize: '$1' }}>
            Size
          </Styled.Label>
          <Styled.Grid>
            {SIZE.map((size) => {
              return (
                <Styled.Item
                  key={size.name}
                  title={size.name}
                  value={size.name}
                  checked={size.value === style.size}
                  color={
                    size.value === style?.size ? 'secondary' : 'secondary-light'
                  }
                >
                  {size.icon({ size: ICON_SIZES.SMALL })}
                </Styled.Item>
              );
            })}
          </Styled.Grid>
        </Styled.InnerContainer>
      )}
    </Styled.Container>
  );
};

export default StylePanel;

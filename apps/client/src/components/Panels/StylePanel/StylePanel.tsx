import { useCallback, useMemo } from 'react';
import type { NodeColor, NodeLIne, NodeSize, NodeStyle } from 'shared';
import { Divider } from '@/components/core/Divider/Divider';
import { ICON_SIZES } from '@/constants/icon';
import { ANIMATED, COLOR, LINE, SIZE } from '@/constants/style';
import { capitalizeFirstLetter } from '@/utils/string';
import {
  ColorCircle,
  ColorPicker,
  StyleButton,
  StylePanelContainer,
  StylePanelRow,
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

  const handleLineSelect = (
    value: NodeLIne,
    name: (typeof LINE)[number]['name'],
  ) => {
    onStyleChange({
      animated: style.animated && name !== 'solid' ? true : false,
      line: value,
    });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !style.animated });
  };

  const handleSizeSelect = (value: NodeSize) => {
    onStyleChange({ size: value });
  };

  const isLineStyleActive = useCallback(
    (value: Readonly<NodeLIne>) => {
      if (!style.line) {
        return false;
      }

      return value.every((line, index) => line === style.line?.[index]);
    },
    [style.line],
  );

  const animatedStyleDisabled = useMemo(() => {
    if (!style.line) {
      return false;
    }

    return style.line.every((l) => l === 0);
  }, [style.line]);

  return (
    <StylePanelContainer>
      <ColorPicker>
        {COLOR.map((color) => {
          return (
            <StyleButton
              key={color.name}
              title={capitalizeFirstLetter(color.name)}
              size="small"
              squared={true}
              color={
                color.value === style.color ? 'secondary' : 'secondary-light'
              }
              onClick={() => handleColorSelect(color.value)}
            >
              <ColorCircle css={{ backgroundColor: color.value }} />
            </StyleButton>
          );
        })}
      </ColorPicker>
      <Divider type="horizontal" />
      {enabledOptions.line && (
        <StylePanelRow>
          {LINE.map((line) => {
            return (
              <StyleButton
                key={line.name}
                title={capitalizeFirstLetter(line.name)}
                size="small"
                squared={true}
                color={
                  isLineStyleActive(line.value)
                    ? 'secondary'
                    : 'secondary-light'
                }
                onClick={() =>
                  handleLineSelect(line.value as NodeLIne, line.name)
                }
              >
                {line.icon({ size: ICON_SIZES.LARGE })}
              </StyleButton>
            );
          })}
          <StyleButton
            key={ANIMATED.value}
            title={capitalizeFirstLetter(ANIMATED.value)}
            size="small"
            squared={true}
            color={style.animated ? 'primary' : 'secondary-light'}
            disabled={animatedStyleDisabled}
            onClick={() => handleAnimatedSelect()}
          >
            {ANIMATED.icon({ size: ICON_SIZES.LARGE })}
          </StyleButton>
        </StylePanelRow>
      )}
      {enabledOptions.size && (
        <StylePanelRow>
          {SIZE.map((size) => {
            return (
              <StyleButton
                key={size.name}
                title={capitalizeFirstLetter(size.name)}
                size="small"
                squared={true}
                color={
                  size.value === style?.size ? 'secondary' : 'secondary-light'
                }
                onClick={() => handleSizeSelect(size.value)}
              >
                {size.icon({ size: ICON_SIZES.LARGE, lineSize: size.value })}
              </StyleButton>
            );
          })}
        </StylePanelRow>
      )}
    </StylePanelContainer>
  );
};

export default StylePanel;

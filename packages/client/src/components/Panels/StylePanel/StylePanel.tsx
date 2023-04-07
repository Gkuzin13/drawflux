import { ICON_SIZES } from '@/constants/icon';
import { capitalizeFirstLetter } from '@/utils/string';
import { NodeLIne, NodeStyle } from '@shared/types';
import { ANIMATED, COLOR, LINE, SIZE } from '@/constants/style';
import { Divider } from '@/components/Divider/Divider';
import {
  ColorCircle,
  ColorPicker,
  StyleButton,
  StylePanelContainer,
  StylePanelRow,
} from './StylePanelStyled';

export type StylePanelProps = {
  style: NodeStyle;
  enabledOptions: {
    line: boolean;
    size: boolean;
  };
  onStyleChange: (updatedStyle: NodeStyle) => void;
};

const StylePanel = ({
  style,
  enabledOptions,
  onStyleChange,
}: StylePanelProps) => {
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
              onClick={() => onStyleChange({ ...style, color: color.value })}
            >
              <ColorCircle style={{ backgroundColor: color.value }} />
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
                  line.value === style?.line ? 'secondary' : 'secondary-light'
                }
                onClick={() => {
                  onStyleChange({
                    ...style,
                    animated:
                      style.animated && line.name !== 'solid' ? true : false,
                    line: line.value as NodeLIne,
                  });
                }}
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
            disabled={style.line.every((l) => l === 0)}
            onClick={() =>
              onStyleChange({ ...style, animated: !style.animated })
            }
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
                onClick={() => onStyleChange({ ...style, size: size.value })}
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

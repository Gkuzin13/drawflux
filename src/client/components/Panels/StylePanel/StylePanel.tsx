import { ICON_SIZES } from '@/client/shared/styles/theme';
import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { NodeLIne, NodeStyle } from '@/client/shared/constants/element';
import { ANIMATED, COLOR, LINE, SIZE } from '@/client/shared/constants/style';
import { Divider } from '@/client/components/Divider/Divider';
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
              size="small"
              squared={true}
              color={
                color.value === style.color ? 'secondary' : 'secondary-light'
              }
              title={capitalizeFirstLetter(color.name)}
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
                size="small"
                squared={true}
                color={
                  line.value === style?.line ? 'secondary' : 'secondary-light'
                }
                key={line.name}
                onClick={() => {
                  onStyleChange({
                    ...style,
                    animated:
                      style.animated && line.name !== 'solid' ? true : false,
                    line: line.value as NodeLIne,
                  });
                }}
              >
                {line.icon({
                  title: capitalizeFirstLetter(line.name),
                  size: ICON_SIZES.MEDIUM,
                })}
              </StyleButton>
            );
          })}
          <StyleButton
            size="small"
            squared={true}
            color={style.animated ? 'primary' : 'secondary-light'}
            disabled={[...style.line].every((l) => l === 0)}
            onClick={() =>
              onStyleChange({ ...style, animated: !style.animated })
            }
          >
            {ANIMATED.icon({
              title: capitalizeFirstLetter(ANIMATED.value),
              size: ICON_SIZES.LARGE,
            })}
          </StyleButton>
        </StylePanelRow>
      )}
      {enabledOptions.size && (
        <StylePanelRow>
          {SIZE.map((size) => {
            return (
              <StyleButton
                key={size.name}
                size="normal"
                squared={true}
                color={
                  size.value === style?.size ? 'secondary' : 'secondary-light'
                }
                onClick={() => onStyleChange({ ...style, size: size.value })}
              >
                {size.icon({
                  title: capitalizeFirstLetter(size.name),
                  size: ICON_SIZES.LARGE,
                  lineSize: size.value,
                })}
              </StyleButton>
            );
          })}
        </StylePanelRow>
      )}
    </StylePanelContainer>
  );
};

export default StylePanel;

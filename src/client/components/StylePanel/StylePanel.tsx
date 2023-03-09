import { ICON_SIZES } from '@/client/shared/styles/theme';
import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { createElement } from 'react';
import { NodeLIne, NodeStyle } from '../../shared/constants/element';
import { ANIMATED, COLOR, LINE, SIZE } from '../../shared/constants/style';
import { Button } from '../Button/Button';
import { Divider } from '../Divider';
import {
  ColorCircle,
  ColorPicker,
  StylePanelContainer,
  StylePanelRow,
} from './StylePanelStyled';

type Props = {
  style: NodeStyle;
  onStyleChange: (updatedStyle: NodeStyle) => void;
};

const StylePanel = ({ style, onStyleChange }: Props) => {
  return (
    <StylePanelContainer>
      <ColorPicker>
        {COLOR.map((color) => {
          return (
            <Button
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
            </Button>
          );
        })}
      </ColorPicker>
      <Divider type="horizontal" />
      <StylePanelRow>
        {LINE.map((line) => {
          return (
            <Button
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
              {createElement(line.icon, {
                title: capitalizeFirstLetter(line.name),
                size: ICON_SIZES.MEDIUM,
              })}
            </Button>
          );
        })}
        <Button
          size="small"
          squared={true}
          color={style.animated ? 'primary' : 'secondary-light'}
          disabled={[...style.line].every((l) => l === 0)}
          onClick={() => onStyleChange({ ...style, animated: !style.animated })}
        >
          {createElement(ANIMATED.icon, {
            title: capitalizeFirstLetter(ANIMATED.value),
            size: ICON_SIZES.MEDIUM,
          })}
        </Button>
      </StylePanelRow>
      <StylePanelRow>
        {SIZE.map((size) => {
          return (
            <Button
              key={size.name}
              size="small"
              squared={true}
              color={
                size.value === style?.size ? 'secondary' : 'secondary-light'
              }
              onClick={() => onStyleChange({ ...style, size: size.value })}
            >
              {createElement(size.icon, {
                title: capitalizeFirstLetter(size.name),
                size: ICON_SIZES.MEDIUM,
              })}
            </Button>
          );
        })}
      </StylePanelRow>
    </StylePanelContainer>
  );
};

export default StylePanel;

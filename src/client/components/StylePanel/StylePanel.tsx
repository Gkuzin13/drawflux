import { createElement } from 'react';
import { NodeStyle } from '../../shared/element';
import { ANIMATED, COLOR, LINE, SIZE } from '../../shared/style';
import {
  ColorCircle,
  ColorPicker,
  DockContainer,
  StyleButton,
} from './StylePanelStyled';

type Props = {
  style: NodeStyle;
  onStyleChange: (updatedStyle: NodeStyle) => void;
};

const ICON_SIZE = 24;

const StyleMenu = ({ style, onStyleChange }: Props) => {
  return (
    <DockContainer>
      <ColorPicker>
        {Object.values(COLOR).map((color) => {
          return (
            <ColorCircle
              key={color}
              disabled={color === style?.color}
              style={{
                backgroundColor: color,
                opacity: color === style?.color ? 1 : 0.5,
              }}
              onClick={() => onStyleChange({ ...style, color })}
            />
          );
        })}
      </ColorPicker>
      {Object.values(LINE).map((line) => {
        return (
          <StyleButton
            key={line.value}
            onClick={() => onStyleChange({ ...style, line: line.value })}
          >
            {createElement(line.icon, { title: line.value, size: ICON_SIZE })}
          </StyleButton>
        );
      })}
      <StyleButton
        onClick={() => onStyleChange({ ...style, animated: !style.animated })}
      >
        {ANIMATED.value}{' '}
        {createElement(ANIMATED.icon, {
          title: ANIMATED.value,
          size: ICON_SIZE,
        })}
      </StyleButton>
      {Object.values(SIZE).map((size) => {
        return (
          <StyleButton
            key={size}
            onClick={() => onStyleChange({ ...style, size })}
          >
            {size}
          </StyleButton>
        );
      })}
    </DockContainer>
  );
};

export default StyleMenu;

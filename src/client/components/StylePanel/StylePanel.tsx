import { createElement } from 'react';
import { NodeStyle } from '../../shared/constants/element';
import { ANIMATED, COLOR, LINE, SIZE } from '../../shared/constants/style';
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
        {COLOR.map((color) => {
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
      {LINE.map((line) => {
        return (
          <StyleButton
            key={line.name}
            onClick={() => onStyleChange({ ...style, line: line.value })}
          >
            {createElement(line.icon, { title: line.name, size: ICON_SIZE })}
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
      {SIZE.map((size) => {
        return (
          <StyleButton
            key={size.name}
            onClick={() => onStyleChange({ ...style, size: size.value })}
          >
            {createElement(size.icon, { title: size.name, size: ICON_SIZE })}
          </StyleButton>
        );
      })}
    </DockContainer>
  );
};

export default StyleMenu;

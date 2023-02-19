import { NodeStyle } from '../shared/element';
import { COLOR, LINE, SIZE } from '../shared/style';

type Props = {
  style: NodeStyle;
  onStyleChange: (updatedStyle: NodeStyle) => void;
};

const StyleMenu = ({ style, onStyleChange }: Props) => {
  return (
    <div>
      Styles
      <div>
        <span>Color:</span>
        {Object.values(COLOR).map((color) => {
          return (
            <button
              key={color}
              disabled={color === style?.color}
              style={{
                backgroundColor: color,
                opacity: color === style?.color ? 1 : 0.5,
              }}
              onClick={() => onStyleChange({ ...style, color })}
            >
              {color}
            </button>
          );
        })}
        <span>Line:</span>
        {Object.values(LINE).map((line) => {
          return (
            <button
              key={line}
              onClick={() => onStyleChange({ ...style, line })}
            >
              {line}
            </button>
          );
        })}
        <button
          onClick={() => onStyleChange({ ...style, animated: !style.animated })}
        >
          Animated
        </button>
        <span>Size:</span>
        {Object.values(SIZE).map((size) => {
          return (
            <button
              key={size}
              onClick={() => onStyleChange({ ...style, size })}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleMenu;

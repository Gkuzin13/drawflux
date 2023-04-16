import { Rect } from 'react-konva';
import { theme } from 'shared';
import { BACKGROUND_LAYER_RECT_ID } from '@/constants/element';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const BackgroundLayerRect = ({ width, height, x, y }: Props) => {
  return (
    <Rect
      id={BACKGROUND_LAYER_RECT_ID}
      x={x}
      y={y}
      height={height}
      width={width}
      perfectDrawEnabled={false}
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      fill={theme.colors.white50.value}
      listening={false}
      draggable={false}
    />
  );
};

export default BackgroundLayerRect;

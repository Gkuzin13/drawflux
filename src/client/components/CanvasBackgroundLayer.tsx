import { RectConfig } from 'konva/lib/shapes/Rect';
import { Layer, Rect } from 'react-konva';
import { theme } from '../shared/styles/theme';

type Props = {
  config: RectConfig;
};

const CanvasBackgroundLayer = ({ config }: Props) => {
  return (
    <Layer listening={false}>
      <Rect
        {...config}
        perfectDrawEnabled={false}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        fill={theme.colors.white50.value}
        listening={false}
      />
    </Layer>
  );
};

export default CanvasBackgroundLayer;

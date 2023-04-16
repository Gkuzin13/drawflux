import { type NodeConfig } from 'konva/lib/Node';
import { type ShapeConfig } from 'konva/lib/Shape';
import type { NodeType } from 'shared';
import ArrowDrawable from '@/components/shapes/ArrowDrawable/ArrowDrawable';
import EditableText from '@/components/shapes/EditableText/EditableText';
import EllipseDrawable from '@/components/shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/components/shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/components/shapes/RectDrawable/RectDrawable';

export const BACKGROUND_LAYER_RECT_ID = 'BackgroundLayerRect';

export const getElement = (element: NodeType) => {
  switch (element) {
    case 'arrow':
      return ArrowDrawable;
    case 'rectangle':
      return RectDrawable;
    case 'ellipse':
      return EllipseDrawable;
    case 'draw':
      return FreePathDrawable;
    case 'text':
      return EditableText;
  }
};

export const createDefaultNodeConfig = ({
  visible,
  strokeWidth,
  stroke,
  id,
  rotation,
  draggable,
  dash,
  ...rest
}: NodeConfig & ShapeConfig): NodeConfig & ShapeConfig => {
  return {
    lineCap: 'round',
    strokeScaleEnabled: false,
    perfectDrawEnabled: false,
    shadowForStrokeEnabled: false,
    hitStrokeWidth: 12,
    fillEnabled: false,
    opacity: 1,
    visible,
    strokeWidth,
    stroke,
    id,
    rotation,
    draggable,
    dash,
    ...rest,
  };
};

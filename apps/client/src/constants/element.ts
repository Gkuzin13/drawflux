import type { NodeType } from 'shared';
import ArrowDrawable from '@/components/shapes/ArrowDrawable/ArrowDrawable';
import EditableText from '@/components/shapes/EditableText/EditableText';
import EllipseDrawable from '@/components/shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/components/shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/components/shapes/RectDrawable/RectDrawable';

export const BACKGROUND_LAYER_ID = 'BackgroundLayerRect';

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

export const TRANSFORMER = {
  MIN_SIZE: 5,
  ROTATION_SNAPS: [0, 90, 180, 270],
  ROTATION_ANCHOR_OFFSET: 14,
  PADDING: 6,
  ANCHOR_CORNER_RADIUS: 5,
  ANCHOR_SIZE: 9,
  ANCHOR_STROKE_WIDTH: 1.5,
};

import { colors } from 'shared';

export const TRANSFORMER = {
  MIN_SIZE: 10,
  ROTATION_SNAPS: [0, 90, 180, 270],
  ROTATION_ANCHOR_OFFSET: 14,
  PADDING: 6,
  ANCHOR_CORNER_RADIUS: 5,
  ANCHOR_SIZE: 9,
  ANCHOR_STROKE_WIDTH: 1.5,
  ANCHOR_STROKE: colors.green300,
  BORDER_STROKE: colors.green300,
};

export const ARROW_TRANSFORMER = {
  RADIUS: 3.75,
  ANCHOR_STROKE_WIDTH: 2.75,
  ANCHOR_STROKE_WIDTH_HOVER: 11,
  HIT_STROKE_WIDTH: 16,
  STROKE: colors.green300,
};

export const RECT = {
  CORNER_RADIUS: 6,
  MIN_SIZE: 10,
};

export const TEXT = {
  PADDING: 4,
  LINE_HEIGHT: 1,
  FONT_FAMILY: 'Klee One',
  FONT_WEIGHT: 'bold',
};

export const SELECT_RECT = {
  STROKE: colors.gray600,
  FILL: colors.gray400,
  OPACITY: 0.1,
};

import { colors } from 'shared';

export const TRANSFORMER = {
  NAME: 'transformer',
  MIN_SIZE: 10,
  ROTATION_SNAPS: [0, 90, 180, 270],
  ROTATION_ANCHOR_OFFSET: 24,
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
  NAME: 'arrow-transformer',
  ANCHOR_NAME: 'arrow-transformer-anchor',
  SNAP_OFFSET: 8
} as const;

export const ARROW = {
  HEAD_WIDTH: 6,
  HEAD_LENGTH: 6,
  DEFAULT_BEND: 0.5,
};

export const FREE_PATH = {
  TENSION: 0.5,
};

export const RECT = {
  CORNER_RADIUS: 6,
  MIN_SIZE: 10,
};

export const ELLIPSE = {
  MIN_RADIUS: 5,
} as const;

export const TEXT = {
  PADDING: 4,
  LINE_HEIGHT: 1,
  FONT_FAMILY: 'Klee One',
  FONT_WEIGHT: 'bold',
  NAME: 'text',
};

export const SELECT_RECT = {
  STROKE: colors.gray600,
  FILL: colors.gray400,
  CORNER_RADIUS: 1,
  OPACITY: 0.1,
};

export const LASER = {
  TRIM_COUNT: 2,
  TRIM_INTERVAL: 24,
  TRIM_DELAY: 250,
  MAX_LENGTH: 50,
  WIDTH: 3.5,
  COLOR: colors.red500,
} as const;

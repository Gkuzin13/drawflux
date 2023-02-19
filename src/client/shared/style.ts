const LINE = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted',
} as const;

const SIZE = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra large',
} as const;

const COLOR = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'black',
  'white',
  'teal',
] as const;

export { LINE, SIZE, COLOR };

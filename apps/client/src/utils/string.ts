import { Util } from 'konva/lib/Util';
import { clamp } from './math';

export function capitalizeFirstLetter(string: string) {
  if (typeof string !== 'string') {
    throw new Error('The provided input must be a string');
  }

  if (!string.length) {
    return '';
  }

  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export const getKeyTitle = (name: string, keys: string[]) => {
  if (typeof name !== 'string') {
    throw new Error('The provided name must be a string');
  }

  const capitalizedName = name.length ? capitalizeFirstLetter(name) : '';

  if (keys.length === 1) {
    return `${capitalizedName} — ${capitalizeFirstLetter(`${keys[0]}`)}`;
  }

  return `${capitalizedName} — ${keys
    .map((key) => capitalizeFirstLetter(`${key}`))
    .join(' + ')}`;
};

export const getStyleTitle = (name: string, value: string) => {
  return `${name} — ${value}`;
};

export const hexToRGBa = (hex: string, alpha = 1) => {
  const { r, g, b } = Util.getRGB(hex);

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, [0, 1])})`;
};

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

export const createTitle = (name: string, value: string) =>
  `${name} — ${value}`;

export const createKeyTitle = (name: string, keys: string[]) => {
  if (typeof name !== 'string') {
    throw new Error('The provided name must be a string');
  }

  const capitalizedName = capitalizeFirstLetter(name);

  if (keys.length === 1) {
    const capitalizedKey = capitalizeFirstLetter(keys[0]);

    return createTitle(capitalizedName, capitalizedKey);
  }

  const joinedKeys = keys
    .map((key) => capitalizeFirstLetter(`${key}`))
    .join(' + ');

  return createTitle(capitalizedName, joinedKeys);
};

export const getRGB = (hex: string) => Util.getRGB(hex);

export const hexToRGBa = (hex: string, alpha = 1) => {
  const { r, g, b } = getRGB(hex);

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, [0, 1])})`;
};

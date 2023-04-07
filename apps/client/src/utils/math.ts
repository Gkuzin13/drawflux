export function getRatioFromValue(value: number, min: number, max: number) {
  return max === min ? 1 : (value - min) / (max - min);
}

export function getValueFromRatio(ratio: number, min: number, max: number) {
  return ratio * (max - min) + min;
}

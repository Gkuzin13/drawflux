export function getRatioFromValue(current: number, min: number, max: number) {
  return (current - min) / (max - min);
}

export function getValueFromRatio(ratio: number, min: number, max: number) {
  return ratio * (max - min) + min;
}

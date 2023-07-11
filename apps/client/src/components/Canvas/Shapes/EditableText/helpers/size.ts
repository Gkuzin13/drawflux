import { TEXT } from '@/constants/shape';

export function getNodeSize(width: number, scale: number, min = 20) {
  return Math.max(width * scale, min);
}

export function getSizePropsFromTextValue(text: string, fontSize: number) {
  const lines = text.split('\n');
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const numberOfLines = lines.length;

  return {
    width: `calc(${longestLine}ch + ${TEXT.PADDING}px)`,
    height: `${
      fontSize * numberOfLines * TEXT.LINE_HEIGHT + TEXT.PADDING * 4
    }px`,
  };
}

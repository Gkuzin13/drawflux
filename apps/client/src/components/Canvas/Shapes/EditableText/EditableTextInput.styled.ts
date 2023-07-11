import { TEXT } from '@/constants/shape';
import { styled } from 'shared';

export const TextArea = styled('textarea', {
  border: 'none',
  margin: '0px',
  background: 'none',
  overflow: 'hidden',
  outline: 'none',
  resize: 'none',
  lineHeight: TEXT.LINE_HEIGHT,
  padding: `${TEXT.PADDING}px`,
  fontFamily: TEXT.FONT_FAMILY,
  fontWeight: TEXT.FONT_WEIGHT,
});

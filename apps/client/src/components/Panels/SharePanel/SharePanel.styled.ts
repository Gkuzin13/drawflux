import Popover from '@/components/Elements/Popover/Popover';
import { styled } from 'shared';

export const PopoverContent = styled(Popover.Content, {
  maxWidth: '$11',
  padding: '$2',
  gap: '$2'
});

export const Info = styled('p', {
  padding: '0 $1 $1 $1',
  fontSize: '$1',
  color: '$gray500',
});

export const QRCodeContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
});

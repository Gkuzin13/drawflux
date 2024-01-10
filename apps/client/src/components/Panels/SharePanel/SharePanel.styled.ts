import Popover from '@/components/Elements/Popover/Popover';
import { styled } from 'shared';

export const PopoverContent = styled(Popover.Content, {
  maxWidth: '$11',
  padding: '$2',
  gap: '$2',
});

export const QRCodeContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
});

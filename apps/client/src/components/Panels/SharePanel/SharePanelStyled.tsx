import * as Popover from '@radix-ui/react-popover';
import { styled } from 'shared';
import { ButtonStyled } from '@/components/Elements/Button/ButtonStyled';

export const SharePanelContent = styled(Popover.Content, {
  padding: '$2',
  display: 'flex',
  gap: '$2',
  flexDirection: 'column',
  boxShadow: '$small',
  maxWidth: '$11',
  borderRadius: '$1',
  marginTop: '$2',
  backgroundColor: '$white50',
});

export const SharePanelInfo = styled('p', {
  padding: '0 $1 $1 $1',
  fontSize: '$1',
  color: '$gray600',
});

export const SharePanelTrigger = styled(Popover.Trigger, ButtonStyled, {
  width: 'calc($5 * 2)',
  defaultVariants: {
    color: 'primary',
    size: 'small',
  },
});

export const QRCodeContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
});

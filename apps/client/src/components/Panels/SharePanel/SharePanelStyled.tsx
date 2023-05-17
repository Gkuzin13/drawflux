import * as Popover from '@radix-ui/react-popover';
import { styled } from 'shared';
import { ButtonStyled } from '@/components/core/Button/ButtonStyled';
import { Panel } from '../PanelsStyled';

export const SharePanelContent = styled(Popover.Content, {
  padding: '$2',
  display: 'flex',
  gap: '$2',
  flexDirection: 'column',
  boxShadow: '$small',
  maxWidth: '$11',
  borderRadius: '$1',
  marginTop: '$2',
});

export const SharePanelDisclamer = styled('p', {
  padding: '0 $1 $1 $1',
  fontSize: '$1',
  color: '$gray600',
});

export const SharePanelTrigger = styled(Popover.Trigger, Panel, ButtonStyled, {
  maxHeight: '$6',
  marginLeft: 'auto',
  defaultVariants: {
    color: 'primary',
  },
});

export const QRCodeContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
});

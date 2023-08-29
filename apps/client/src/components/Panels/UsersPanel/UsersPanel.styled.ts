import * as Popover from '@radix-ui/react-popover';
import { styled } from 'shared';
import * as PanelStyled from '../Panels.styled';
import ColorCircle from '@/components/Elements/ColorCircle/ColorCircle';

export const Container = styled(PanelStyled.Panel, {});

export const Content = styled(Popover.Content, {
  padding: '$1',
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
  boxShadow: '$sm',
  borderRadius: '$1',
  marginTop: '$2',
  backgroundColor: '$bg',
});

export const Trigger = styled(Popover.Trigger, PanelStyled.Button);

export const Info = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$1',
  flexShrink: 0,
  minHeight: '$5',
  marginLeft: '$2',
});

export const Indicator = styled('span', {
  color: '$gray500',
  paddingRight: '$2',
});

export const Name = styled('span', {});

export const Color = styled(ColorCircle, {
  flexShrink: 0,
});

import { styled } from 'shared';
import ColorCircle from '@/components/Elements/ColorCircle/ColorCircle';
import * as Popover from '@radix-ui/react-popover';
import * as PanelStyled from '../Panels.styled';

export const Container = styled(PanelStyled.Panel, {
  margin: '0 $2 0 auto'
});

export const Content = styled(Popover.Content, {
  padding: '$1',
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
  boxShadow: '$sm',
  borderRadius: '$2',
  marginTop: '$2',
  backgroundColor: '$bg',
  button: {
    display: 'grid',
    placeItems: 'center',
  },
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

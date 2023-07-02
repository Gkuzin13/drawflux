import * as Popover from '@radix-ui/react-popover';
import { TbCircleFilled } from 'react-icons/tb';
import { styled } from 'shared';
import * as PanelStyled from '../Panels.styled';

export const Container = styled(PanelStyled.Panel, {});

export const Content = styled(Popover.Content, {
  padding: '$2',
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
  boxShadow: '$small',
  borderRadius: '$1',
  marginTop: '$2',
  backgroundColor: '$white50',
});

export const Trigger = styled(Popover.Trigger, PanelStyled.Button);

export const Info = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$1',
  flexShrink: 0,
  minHeight: '$5',
});

export const Indicator = styled('span', {
  color: '$gray500',
  paddingRight: '$2',
});

export const Name = styled('span', {});

export const Color = styled(TbCircleFilled, {
  flexShrink: 0,
});

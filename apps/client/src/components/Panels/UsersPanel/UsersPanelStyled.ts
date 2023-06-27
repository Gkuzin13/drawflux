import * as Popover from '@radix-ui/react-popover';
import { TbCircleFilled } from 'react-icons/tb';
import { styled } from 'shared';
import { Panel, PanelButton } from '../PanelsStyled';

export const UsersPanelContainer = styled(Panel, {});

export const UsersPanelContent = styled(Popover.Content, {
  padding: '$2',
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
  boxShadow: '$small',
  borderRadius: '$1',
  marginTop: '$2',
  backgroundColor: '$white50',
});

export const UsersPanelTrigger = styled(Popover.Trigger, PanelButton);

export const UserInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$1',
  flexShrink: 0,
  minHeight: '$5',
});

export const UserIndicator = styled('span', {
  color: '$gray500',
  paddingRight: '$2',
});

export const UserName = styled('span', {});

export const UserColor = styled(TbCircleFilled, {
  flexShrink: 0,
});

import { styled } from 'shared';
import ColorCircle from '@/components/Elements/ColorCircle/ColorCircle';
import Popover from '@/components/Elements/Popover/Popover';
import { Button } from '@/components/Elements/Button/Button.styled';
import * as PanelStyled from '../Panels.styled';

export const Container = styled(PanelStyled.Panel, {
  margin: '0 $2 0 auto',
});

export const PopoverContent = styled(Popover.Content, {
  minWidth: '$11',
  padding: '$1',
});

export const ColorsPopoverContent = styled(Popover.Content, {
  padding: '$1',
});

export const Trigger = styled(Popover.Trigger, PanelStyled.Button);

export const ColorChangeTrigger = styled(Popover.Trigger, {
  display: 'grid',
  placeItems: 'center',
});

export const Info = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$1',
  flexShrink: 0,
  minHeight: '$5',
  marginLeft: '$2',
});

export const Color = styled(ColorCircle, {
  flexShrink: 0,
});

export const EditUsernameButton = styled(Button, {
  marginLeft: 'auto',
  variants: {
    editing: {
      true: {
        color: '$primary',
      },
    },
  },
});

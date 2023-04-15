import { styled } from 'shared';
import Button from '../core/Button/Button';

export const ContextMenuContainer = styled('div', {
  width: '150px',
  zIndex: 1,
  backgroundColor: '$white',
  boxShadow: '$small',
  borderRadius: '$1',
});

export const ContextMenuButton = styled(Button, {
  justifyContent: 'space-between',
  width: '100%',
});

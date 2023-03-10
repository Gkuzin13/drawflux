import { styled } from '@/client/shared/styles/theme';
import Button from '../Button/Button';

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

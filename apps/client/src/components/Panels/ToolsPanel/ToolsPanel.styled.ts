import { styled } from 'shared';
import { Panel } from '../Panels.styled';
import Divider from '@/components/Elements/Divider/Divider';

export const Container = styled(Panel, {
  height: '100%',
});

export const ToolsDivider = styled(Divider, {
  marginInline: '$1',
  maxHeight: 'calc(100% - $2)'
});

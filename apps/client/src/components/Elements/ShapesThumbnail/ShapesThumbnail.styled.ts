import { Stage as KonvaStage } from 'react-konva';
import { styled } from 'shared';

export const Stage = styled(KonvaStage, {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: '100%'
});

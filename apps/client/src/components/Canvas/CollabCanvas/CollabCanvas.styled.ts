import { styled } from 'shared';
import { Stage as KonvaStage } from 'react-konva';

export const Stage = styled(KonvaStage, {
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  touchAction: 'none',
});

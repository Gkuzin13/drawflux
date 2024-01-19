import { styled } from 'shared';
import { Stage as KonvaStage } from 'react-konva';

export const Stage = styled(KonvaStage, {
  touchAction: 'none',
});

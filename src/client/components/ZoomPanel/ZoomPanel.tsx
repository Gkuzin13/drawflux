import { IoAdd, IoRemove, IoRemoveOutline } from 'react-icons/io5';
import { Button } from '../Button/ButtonStyled';
import {
  ZoomPanelButton,
  ZoomPanelContainer,
  ZoomPanelValue,
} from './ZoomPanelStyled';

type Props = {
  value: number;
  onZoomIncrease: () => void;
  onZoomDecrease: () => void;
};

const ZoomPanel = ({ value, onZoomIncrease, onZoomDecrease }: Props) => {
  const stageScalePercent = `${Math.round(value * 100)}%`;

  return (
    <ZoomPanelContainer>
      <ZoomPanelValue>{stageScalePercent}</ZoomPanelValue>
      <ZoomPanelButton onClick={onZoomIncrease}>
        <IoAdd />
      </ZoomPanelButton>
      <ZoomPanelButton onClick={onZoomDecrease}>
        <IoRemove />
      </ZoomPanelButton>
    </ZoomPanelContainer>
  );
};

export default ZoomPanel;

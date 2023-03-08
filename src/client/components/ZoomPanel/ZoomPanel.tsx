import { ZoomPanelContainer, ZoomPanelValue } from './ZoomPanelStyled';

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
      <div>
        <button onClick={onZoomIncrease}>+</button>
        <button onClick={onZoomDecrease}>-</button>
      </div>
    </ZoomPanelContainer>
  );
};

export default ZoomPanel;

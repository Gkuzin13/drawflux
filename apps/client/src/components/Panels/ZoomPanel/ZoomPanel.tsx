import { ZOOM, ZoomAction } from '@/constants/zoom';
import { ZoomPanelButton, ZoomPanelContainer } from './ZoomPanelStyled';

type Props = {
  value: number;
  onZoomChange: (value: number) => void;
};

const ZoomPanel = ({ value, onZoomChange }: Props) => {
  const stageScalePercent = `${Math.round(value * 100)}%`;

  const getScaleValueByAction = (currentValue: number, action: ZoomAction) => {
    switch (action) {
      case 'increase':
        return currentValue + 0.1;
      case 'decrease':
        return currentValue - 0.1;
      case 'reset':
        return 1;
      default:
        return 1;
    }
  };

  const handleZoomAction = (action: ZoomAction) => {
    const newValue = getScaleValueByAction(value, action);
    onZoomChange(newValue);
  };

  return (
    <ZoomPanelContainer>
      <ZoomPanelButton
        title={ZOOM.RESET.name}
        onClick={() => handleZoomAction(ZOOM.RESET.value)}
      >
        {stageScalePercent}
      </ZoomPanelButton>
      <ZoomPanelButton
        title={ZOOM.IN.name}
        onClick={() => handleZoomAction(ZOOM.IN.value)}
      >
        {ZOOM.IN.icon({})}
      </ZoomPanelButton>
      <ZoomPanelButton
        title={ZOOM.OUT.name}
        onClick={() => handleZoomAction(ZOOM.OUT.value)}
      >
        {ZOOM.OUT.icon({})}
      </ZoomPanelButton>
    </ZoomPanelContainer>
  );
};

export default ZoomPanel;

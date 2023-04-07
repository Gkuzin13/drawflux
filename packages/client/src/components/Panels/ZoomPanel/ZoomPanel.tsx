import { ZOOM, ZoomValue } from '@/constants/zoom';
import { ZoomPanelButton, ZoomPanelContainer } from './ZoomPanelStyled';

type Props = {
  value: number;
  onZoomChange: (action: ZoomValue) => void;
};

const ZoomPanel = ({ value, onZoomChange }: Props) => {
  const stageScalePercent = `${Math.round(value * 100)}%`;

  return (
    <ZoomPanelContainer>
      <ZoomPanelButton
        title={ZOOM.RESET.name}
        onClick={() => onZoomChange(ZOOM.RESET.value)}
      >
        {stageScalePercent}
      </ZoomPanelButton>
      <ZoomPanelButton
        title={ZOOM.IN.name}
        onClick={() => onZoomChange(ZOOM.IN.value)}
      >
        {ZOOM.IN.icon({})}
      </ZoomPanelButton>
      <ZoomPanelButton
        title={ZOOM.OUT.name}
        onClick={() => onZoomChange(ZOOM.OUT.value)}
      >
        {ZOOM.OUT.icon({})}
      </ZoomPanelButton>
    </ZoomPanelContainer>
  );
};

export default ZoomPanel;

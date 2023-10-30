import { memo } from 'react';
import {
  ZOOM_MULTIPLIER_VALUE,
  DEFAULT_ZOOM_VALUE,
  ZOOM_RANGE,
} from '@/constants/app';
import { ZOOM, type ZoomAction } from '@/constants/panels/zoom';
import * as PanelStyled from '../Panels.styled';
import * as Styled from './ZoomPanel.styled';
import Icon from '@/components/Elements/Icon/Icon';
import { createKeyTitle } from '@/utils/string';

type Props = {
  value: number;
  onZoomChange: (value: number) => void;
};

const ZoomPanel = ({ value, onZoomChange }: Props) => {
  const stageScalePercent = `${Math.round(value * 100)}%`;

  const getScaleValueByAction = (currentValue: number, action: ZoomAction) => {
    switch (action) {
      case 'increase':
        return Math.min(currentValue + ZOOM_MULTIPLIER_VALUE, ZOOM_RANGE.MAX);
      case 'decrease':
        return Math.max(currentValue - ZOOM_MULTIPLIER_VALUE, ZOOM_RANGE.MIN);
      case 'reset':
        return DEFAULT_ZOOM_VALUE;
      default:
        return DEFAULT_ZOOM_VALUE;
    }
  };

  const handleZoomAction = (action: ZoomAction) => {
    const newValue = getScaleValueByAction(value, action);
    onZoomChange(newValue);
  };

  return (
    <Styled.Container>
      <PanelStyled.Button
        disabled={value === DEFAULT_ZOOM_VALUE}
        title={ZOOM.reset.name}
        data-testId="zoom-reset-button"
        css={{ fontSize: '$1', width: 'calc($5 * 1.5)' }}
        onClick={() => handleZoomAction(ZOOM.reset.value)}
      >
        {stageScalePercent}
      </PanelStyled.Button>
      <PanelStyled.Button
        disabled={value === ZOOM_RANGE.MAX}
        title={createKeyTitle(ZOOM.in.name, [
          ZOOM.in.key,
          ...ZOOM.in.modifierKeys,
        ])}
        data-testId="zoom-in-button"
        onClick={() => handleZoomAction(ZOOM.in.value)}
      >
        <Icon name={ZOOM.in.icon} size="sm" />
      </PanelStyled.Button>
      <PanelStyled.Button
        disabled={value === ZOOM_RANGE.MIN}
        title={createKeyTitle(ZOOM.out.name, [
          ZOOM.out.key,
          ...ZOOM.out.modifierKeys,
        ])}
        data-testId="zoom-out-button"
        onClick={() => handleZoomAction(ZOOM.out.value)}
      >
        <Icon name={ZOOM.out.icon} size="sm" />
      </PanelStyled.Button>
    </Styled.Container>
  );
};

export default memo(ZoomPanel);

import { memo } from 'react';
import { DEFAULT_ZOOM_VALUE, ZOOM_RANGE } from '@/constants/app';
import { ZOOM, type ZoomActionKey } from '@/constants/panels';
import Icon from '@/components/Elements/Icon/Icon';
import { createKeyTitle } from '@/utils/string';
import * as Styled from './Panels.styled';

type Props = {
  value: number;
  onZoomChange: (action: ZoomActionKey) => void;
};

const ZoomPanel = ({ value, onZoomChange }: Props) => {
  const stageScalePercent = `${Math.round(value * 100)}%`;

  const handleZoomAction = (action: ZoomActionKey) => {
    onZoomChange(action);
  };

  return (
    <>
      <Styled.Button
        disabled={value === DEFAULT_ZOOM_VALUE}
        title={ZOOM.reset.name}
        data-testid="zoom-reset-button"
        css={{ fontSize: '$1', width: 'calc($5 * 1.5)' }}
        onClick={() => handleZoomAction('reset')}
      >
        {stageScalePercent}
      </Styled.Button>
      <Styled.Button
        disabled={value === ZOOM_RANGE[1]}
        title={createKeyTitle(ZOOM.in.name, [
          ZOOM.in.key,
          ...ZOOM.in.modifierKeys,
        ])}
        data-testid="zoom-in-button"
        onClick={() => handleZoomAction('in')}
      >
        <Icon name={ZOOM.in.icon} size="sm" />
      </Styled.Button>
      <Styled.Button
        disabled={value === ZOOM_RANGE[0]}
        title={createKeyTitle(ZOOM.out.name, [
          ZOOM.out.key,
          ...ZOOM.out.modifierKeys,
        ])}
        data-testid="zoom-out-button"
        onClick={() => handleZoomAction('out')}
      >
        <Icon name={ZOOM.out.icon} size="sm" />
      </Styled.Button>
    </>
  );
};

export default memo(ZoomPanel);

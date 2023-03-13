import { createElement } from 'react';
import { CONTROL, ControlValue } from '@/client/shared/constants/control';
import Button from '@/client/components/Button/Button';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';

type Props = {
  onControl: (type: ControlValue) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  clearDisabled: boolean;
};

const ControlPanel = ({
  undoDisabled,
  redoDisabled,
  clearDisabled,
  onControl,
}: Props) => {
  const getDisabledByControlValue = (value: ControlValue) => {
    switch (value) {
      case 'history/undo':
        return undoDisabled;
      case 'history/redo':
        return redoDisabled;
      case 'nodes/deleteAll':
        return clearDisabled;
      default:
        return false;
    }
  };
  return (
    <ControlPanelContainer>
      <ControlPanelRow>
        {CONTROL.map((control) => {
          return (
            <Button
              key={control.value}
              color="secondary"
              size="small"
              title={control.name}
              squared={true}
              disabled={getDisabledByControlValue(control.value)}
              onClick={() => onControl(control.value)}
            >
              {createElement(control.icon)}
            </Button>
          );
        })}
      </ControlPanelRow>
    </ControlPanelContainer>
  );
};

export default ControlPanel;

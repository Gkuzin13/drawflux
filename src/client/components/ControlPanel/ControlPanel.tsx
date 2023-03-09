import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { createElement } from 'react';
import { CONTROL } from '../../shared/constants/control';
import { ActionType } from '../../stores/actions';
import { Button } from '../Button/Button';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';

type Props = {
  onHistoryControl: (type: ActionType) => void;
  onNodesControl: (action: any) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  clearDisabled: boolean;
};

type ControlValue = (typeof CONTROL)[number]['value'];

const ControlPanel = ({
  onHistoryControl,
  onNodesControl,
  undoDisabled,
  redoDisabled,
  clearDisabled,
}: Props) => {
  const dispatchActionByControlValue = (value: ControlValue) => {
    if (value === 'clear') {
      onNodesControl(value);
      return;
    }
    onHistoryControl(value);
  };

  const getDisabledByControlValue = (value: ControlValue) => {
    switch (value) {
      case 'undo':
        return undoDisabled;
      case 'redo':
        return redoDisabled;
      case 'clear':
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
              title={capitalizeFirstLetter(control.value)}
              squared={true}
              disabled={getDisabledByControlValue(control.value)}
              onClick={() => dispatchActionByControlValue(control.value)}
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

import { CONTROL, ControlValue } from '@/constants/control';
import Button from '@/components/Button/Button';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';
import { getKeyTitle } from '@/utils/string';

type Props = {
  onControl: (type: ControlValue) => void;
  enabledControls: {
    undo: boolean;
    redo: boolean;
    clear: boolean;
  };
};

const ControlPanel = ({ enabledControls, onControl }: Props) => {
  const getDisabledByControlValue = (value: ControlValue['type']) => {
    switch (value) {
      case 'history/undo':
        return !enabledControls.undo;
      case 'history/redo':
        return !enabledControls.redo;
      case 'nodes/deleteAll':
        return !enabledControls.clear;
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
              key={control.name}
              color="secondary"
              size="small"
              title={getKeyTitle(control.name, [
                ...control.modifierKeys.map((key) => key.replace(/key/i, '')),
                control.key,
              ])}
              squared={true}
              disabled={getDisabledByControlValue(control.value.type)}
              onClick={() => onControl(control.value)}
            >
              {control.icon({})}
            </Button>
          );
        })}
      </ControlPanelRow>
    </ControlPanelContainer>
  );
};

export default ControlPanel;

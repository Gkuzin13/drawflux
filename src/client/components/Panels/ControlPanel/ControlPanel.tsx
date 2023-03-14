import { CONTROL, ControlValue } from '@/client/shared/constants/control';
import Button from '@/client/components/Button/Button';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';
import { getKeyTitle } from '@/client/shared/utils/string';

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
  const getDisabledByControlValue = (value: ControlValue['type']) => {
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
              key={control.name}
              color="secondary"
              size="small"
              title={getKeyTitle(control.name, [
                ...control.modifierKeys,
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

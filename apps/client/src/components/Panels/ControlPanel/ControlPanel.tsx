import Button from '@/components/core/Button/Button';
import { CONTROL, type ControlAction } from '@/constants/control';
import { getKeyTitle } from '@/utils/string';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';

type Props = {
  onControl: (type: ControlAction) => void;
  enabledControls: {
    undo: boolean;
    redo: boolean;
    deleteSelectedNodes: boolean;
  };
};

const ControlPanel = ({ enabledControls, onControl }: Props) => {
  const getDisabledByControlValue = (action: ControlAction) => {
    switch (action.type) {
      case 'history/undo':
        return !enabledControls.undo;
      case 'history/redo':
        return !enabledControls.redo;
      case 'nodes/delete':
        return !enabledControls.deleteSelectedNodes;
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
              disabled={getDisabledByControlValue(control.value)}
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

import { ICON_SIZES } from '@/constants/icon';
import { CONTROL, type ControlAction } from '@/constants/panels/control';
import { getKeyTitle } from '@/utils/string';
import { Panel, PanelButton } from '../PanelsStyled';

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
      case 'canvas/deleteNodes':
        return !enabledControls.deleteSelectedNodes;
      default:
        return false;
    }
  };
  return (
    <Panel>
      {CONTROL.map((control) => {
        return (
          <PanelButton
            key={control.name}
            title={getKeyTitle(control.name, [
              ...control.modifierKeys.map((key) => key.replace(/key/i, '')),
              control.key,
            ])}
            disabled={getDisabledByControlValue(control.value)}
            onClick={() => onControl(control.value)}
          >
            {control.icon({ size: ICON_SIZES.SMALL })}
          </PanelButton>
        );
      })}
    </Panel>
  );
};

export default ControlPanel;

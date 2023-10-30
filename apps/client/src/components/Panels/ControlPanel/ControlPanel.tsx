import { memo } from 'react';
import { CONTROL } from '@/constants/panels/control';
import { createKeyTitle } from '@/utils/string';
import * as PanelStyled from '../Panels.styled';
import Icon from '@/components/Elements/Icon/Icon';

export type ControlActionKey = (typeof CONTROL)[number]['value'];

type Props = {
  onControl: (actionType: ControlActionKey) => void;
  enabledControls: {
    undo: boolean;
    redo: boolean;
    deleteSelectedNodes: boolean;
  };
};

const ControlPanel = ({ enabledControls, onControl }: Props) => {
  const getDisabledByControlValue = (actionType: ControlActionKey) => {
    switch (actionType) {
      case 'undo':
        return !enabledControls.undo;
      case 'redo':
        return !enabledControls.redo;
      case 'deleteNodes':
        return !enabledControls.deleteSelectedNodes;
      default:
        return false;
    }
  };

  return (
    <PanelStyled.Panel>
      {CONTROL.map((control) => {
        return (
          <PanelStyled.Button
            key={control.name}
            title={createKeyTitle(control.name, [
              ...control.modifierKeys,
              control.key,
            ])}
            disabled={getDisabledByControlValue(control.value)}
            onClick={() => onControl(control.value)}
          >
            <Icon name={control.icon} />
          </PanelStyled.Button>
        );
      })}
    </PanelStyled.Panel>
  );
};

export default memo(ControlPanel);

import { memo } from 'react';
import { CONTROL } from '@/constants/panels/control';
import { createKeyTitle } from '@/utils/string';
import Icon from '@/components/Elements/Icon/Icon';
import * as Styled from '../Panels.styled';
import type { ComponentProps } from '@stitches/react';

export type ControlActionKey = (typeof CONTROL)[number]['value'];

type Props = {
  onControl: (actionType: ControlActionKey) => void;
  enabledControls: {
    undo: boolean;
    redo: boolean;
    deleteSelectedNodes: boolean;
  };
} & ComponentProps<(typeof Styled)['Panel']>;

const ControlPanel = ({ enabledControls, onControl, ...restProps }: Props) => {
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
    <Styled.Panel {...restProps}>
      {CONTROL.map((control) => {
        return (
          <Styled.Button
            key={control.name}
            title={createKeyTitle(control.name, [
              ...control.modifierKeys,
              control.key,
            ])}
            disabled={getDisabledByControlValue(control.value)}
            onClick={() => onControl(control.value)}
          >
            <Icon name={control.icon} />
          </Styled.Button>
        );
      })}
    </Styled.Panel>
  );
};

export default memo(ControlPanel);

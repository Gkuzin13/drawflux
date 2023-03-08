import { createElement } from 'react';
import { HISTORY } from '../../shared/constants/history';
import { ActionType } from '../../stores/actions';
import { nodesActions } from '../../stores/slices/nodesSlice';
import { ControlPanelContainer } from './ControlPanelStyled';

type Props = {
  onHistoryControl: (type: ActionType) => void;
  onNodesControl: (action: any) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
};

const ControlPanel = ({
  onHistoryControl,
  onNodesControl,
  undoDisabled,
  redoDisabled,
}: Props) => {
  return (
    <ControlPanelContainer>
      <button disabled={undoDisabled} onClick={() => onHistoryControl('undo')}>
        {createElement(HISTORY[0].icon)}
      </button>
      <button disabled={redoDisabled} onClick={() => onHistoryControl('redo')}>
        {createElement(HISTORY[1].icon)}
      </button>
      <button onClick={() => onNodesControl(nodesActions.deleteAll())}>
        Clear All
      </button>
    </ControlPanelContainer>
  );
};

export default ControlPanel;

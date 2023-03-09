import { createElement } from 'react';
import { HISTORY } from '../../shared/constants/history';
import { ActionType } from '../../stores/actions';
import { nodesActions } from '../../stores/slices/nodesSlice';
import { Button } from '../Button/ButtonStyled';
import { ControlPanelContainer, ControlPanelRow } from './ControlPanelStyled';

type Props = {
  onHistoryControl: (type: ActionType) => void;
  onNodesControl: (action: any) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  clearDisabled: boolean;
};

const ControlPanel = ({
  onHistoryControl,
  onNodesControl,
  undoDisabled,
  redoDisabled,
  clearDisabled,
}: Props) => {
  return (
    <ControlPanelContainer>
      <ControlPanelRow>
        <Button
          color="secondary"
          size="small"
          title="Undo"
          squared={true}
          disabled={undoDisabled}
          onClick={() => onHistoryControl('undo')}
        >
          {createElement(HISTORY[0].icon)}
        </Button>
        <Button
          color="secondary"
          size="small"
          title="Redo"
          squared={true}
          disabled={redoDisabled}
          onClick={() => onHistoryControl('redo')}
        >
          {createElement(HISTORY[1].icon)}
        </Button>
        <Button
          color="secondary"
          size="small"
          title="Clear All"
          disabled={clearDisabled}
          onClick={() => onNodesControl(nodesActions.deleteAll())}
        >
          Clear
        </Button>
      </ControlPanelRow>
    </ControlPanelContainer>
  );
};

export default ControlPanel;

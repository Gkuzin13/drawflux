import { createElement } from 'react';
import { HISTORY } from '../shared/history';
import { ActionType } from '../stores/actions';
import { nodesActions } from '../stores/slices/nodesSlice';

type Props = {
  onHistoryControl: (type: ActionType) => void;
  onNodesControl: (action: any) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
};

const ControlDock = ({
  onHistoryControl,
  onNodesControl,
  undoDisabled,
  redoDisabled,
}: Props) => {
  return (
    <div>
      <button onClick={() => onNodesControl(nodesActions.deleteAll())}>
        Clear All
      </button>
      <div>
        <button
          disabled={undoDisabled}
          onClick={() => onHistoryControl('undo')}
        >
          {createElement(HISTORY[0].icon)}
        </button>
        <button
          disabled={redoDisabled}
          onClick={() => onHistoryControl('redo')}
        >
          {createElement(HISTORY[1].icon)}
        </button>
      </div>
    </div>
  );
};

export default ControlDock;

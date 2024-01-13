import { memo } from 'react';
import Icon from '../Elements/Icon/Icon';
import { HISTORY } from '@/constants/panels';
import { createKeyTitle } from '@/utils/string';
import * as Styled from './Panels.styled';
import type { HistoryControlKey } from '@/constants/panels';

type Props = {
  disabledUndo: boolean;
  disabledRedo: boolean;
  onClick: (type: HistoryControlKey) => void;
};

const { undo, redo } = HISTORY;

const HistoryButtons = ({ disabledUndo, disabledRedo, onClick }: Props) => {
  return (
    <>
      <Styled.Button
        title={createKeyTitle(undo.name, [...undo.modifierKeys, undo.key])}
        disabled={disabledUndo}
        onClick={() => onClick(undo.value)}
        data-testid="undo-history-button"
      >
        <Icon name={undo.icon} />
      </Styled.Button>
      <Styled.Button
        title={createKeyTitle(redo.name, [...redo.modifierKeys, redo.key])}
        disabled={disabledRedo}
        onClick={() => onClick(redo.value)}
        data-testid="redo-history-button"
      >
        <Icon name={redo.icon} />
      </Styled.Button>
    </>
  );
};

export default memo(HistoryButtons);

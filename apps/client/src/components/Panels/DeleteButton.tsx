import Icon from '../Elements/Icon/Icon';
import { DELETE_NODES } from '@/constants/panels';
import { createKeyTitle } from '@/utils/string';
import { memo } from 'react';
import * as Styled from './Panels.styled';

type Props = {
  disabled: boolean;
  onClick: () => void;
};

const DeleteButton = ({ disabled, onClick }: Props) => {
  return (
    <Styled.Button
      title={createKeyTitle(DELETE_NODES.name, [
        ...DELETE_NODES.modifierKeys,
        DELETE_NODES.key,
      ])}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={DELETE_NODES.icon} />
    </Styled.Button>
  );
};

export default memo(DeleteButton);

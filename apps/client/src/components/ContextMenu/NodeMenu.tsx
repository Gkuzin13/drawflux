import Divider from '@/components/Elements/Divider/Divider';
import Kbd from '@/components/Elements/Kbd/Kbd';
import * as Styled from './ContextMenu.styled';

export type NodeMenuAction =
  | 'copy-nodes'
  | 'duplicate-nodes'
  | 'add-to-library'
  | 'move-nodes-to-end'
  | 'move-nodes-forward'
  | 'move-nodes-backward'
  | 'move-nodes-to-start'
  | 'select-none'
  | 'delete-nodes';

type Props = {
  onAction: (action: NodeMenuAction) => void;
};

const NodeMenu = ({ onAction }: Props) => {
  return (
    <>
      <Styled.Item onSelect={() => onAction('copy-nodes')}>
        Copy <Kbd>Ctrl + C</Kbd>
      </Styled.Item>
      <Styled.Item onSelect={() => onAction('duplicate-nodes')}>
        Duplicate <Kbd>Ctrl + D</Kbd>
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => onAction('add-to-library')}>
        Add to library
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => onAction('move-nodes-to-end')}>
        Bring to front
      </Styled.Item>
      <Styled.Item onSelect={() => onAction('move-nodes-forward')}>
        Bring forward
      </Styled.Item>
      <Styled.Item onSelect={() => onAction('move-nodes-backward')}>
        Send backward
      </Styled.Item>
      <Styled.Item onSelect={() => onAction('move-nodes-to-start')}>
        Send to back
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => onAction('select-none')}>
        Select None
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => onAction('delete-nodes')}>
        Delete
        <Kbd>Del</Kbd>
      </Styled.Item>
    </>
  );
};

export default NodeMenu;

import Divider from '@/components/Elements/Divider/Divider';
import Kbd from '@/components/Elements/Kbd/Kbd';
import * as Styled from './ContextMenu.styled';

export type CanvasMenuAction = 'paste-nodes' | 'select-all';

type Props = {
  onAction: (action: CanvasMenuAction) => void;
};

const CanvasMenu = ({ onAction }: Props) => {
  return (
    <>
      <Styled.Item onSelect={() => onAction('paste-nodes')}>
        Paste <Kbd>Ctrl + V</Kbd>
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => onAction('select-all')}>
        Select All <Kbd>Ctrl + A</Kbd>
      </Styled.Item>
    </>
  );
};

export default CanvasMenu;

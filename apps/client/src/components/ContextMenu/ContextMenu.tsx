import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { type PropsWithChildren, type ReactNode, useCallback } from 'react';
import Divider from '@/components/Elements/Divider/Divider';
import Kbd from '@/components/Elements/Kbd/Kbd';
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import { canvasActions, selectSelectedNodesIds } from '@/services/canvas/slice';
import { libraryActions } from '@/services/library/slice';
import { duplicateNodesToRight, mapNodesIds } from '@/utils/node';
import * as Styled from './ContextMenu.styled';

export type ContextMenuType = 'node-menu' | 'canvas-menu';

type RootProps = PropsWithChildren<{
  children: ReactNode;
  onContextMenuOpen: (open: boolean) => void;
}>;

type TriggerProps = ContextMenuPrimitive.ContextMenuTriggerProps;

type NodesMenuActionKey = Extract<
  keyof typeof canvasActions,
  | 'moveNodesToStart'
  | 'moveNodesToEnd'
  | 'moveNodesBackward'
  | 'moveNodesForward'
  | 'deleteNodes'
>;

const CanvasMenu = () => {
  const dispatch = useAppDispatch();

  const handleSelectAll = useCallback(() => {
    dispatch(canvasActions.selectAllNodes());
  }, [dispatch]);

  const handlePaste = useCallback(() => {
    dispatch(canvasActions.pasteNodes());

  }, [dispatch]);

  return (
    <>
      <Styled.Item onSelect={handlePaste}>
        Paste <Kbd>Ctrl + V</Kbd>
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={handleSelectAll}>
        Select All <Kbd>Ctrl + A</Kbd>
      </Styled.Item>
    </>
  );
};

const NodeMenu = () => {
  const store = useAppStore();
  const selectedNodesIds = useAppSelector(selectSelectedNodesIds);

  const dispatch = useAppDispatch();

  const dispatchNodesAction = (actionKey: NodesMenuActionKey) => {
    const nodesIds = Object.keys(selectedNodesIds);
    const action = canvasActions[actionKey];

    dispatch(action(nodesIds));
  };

  const handleNodesDuplicate = () => {
    const nodesIds = new Set(Object.keys(selectedNodesIds));
    const nodes = store.getState().canvas.present.nodes;
    const nodesToDuplicate = nodes.filter(({ nodeProps }) =>
      nodesIds.has(nodeProps.id),
    );

    const duplicatedNodes = duplicateNodesToRight(nodesToDuplicate);
    const duplicatedNodesIds = mapNodesIds(duplicatedNodes);

    dispatch(canvasActions.addNodes(duplicatedNodes));
    dispatch(canvasActions.setSelectedNodesIds(duplicatedNodesIds));
  };

  const handleSelectNone = () => {
    dispatch(canvasActions.setSelectedNodesIds([]));
  };

  const handleCopy = () => {
    dispatch(canvasActions.copyNodes());
  };

  const handleAddToLibrary = () => {
    const { nodes, selectedNodesIds } = store.getState().canvas.present;
    const nodesToAdd = nodes.filter(
      (node) => node.nodeProps.id in selectedNodesIds,
    );

    dispatch(libraryActions.addItem(nodesToAdd));
  };

  return (
    <>
      <Styled.Item onSelect={handleCopy}>
        Copy <Kbd>Ctrl + C</Kbd>
      </Styled.Item>
      <Styled.Item onSelect={handleNodesDuplicate}>
        Duplicate <Kbd>Ctrl + D</Kbd>
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={handleAddToLibrary}>Add to library</Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => dispatchNodesAction('moveNodesToEnd')}>
        Bring to front
      </Styled.Item>
      <Styled.Item onSelect={() => dispatchNodesAction('moveNodesForward')}>
        Bring forward
      </Styled.Item>
      <Styled.Item onSelect={() => dispatchNodesAction('moveNodesBackward')}>
        Send backward
      </Styled.Item>
      <Styled.Item onSelect={() => dispatchNodesAction('moveNodesToStart')}>
        Send to back
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={handleSelectNone}>Select None</Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={() => dispatchNodesAction('deleteNodes')}>
        Delete
        <Kbd>Del</Kbd>
      </Styled.Item>
    </>
  );
};

const menus: Record<ContextMenuType, React.FC> = {
  'node-menu': NodeMenu,
  'canvas-menu': CanvasMenu,
};

const Trigger = ({ children }: TriggerProps) => {
  return (
    <ContextMenuPrimitive.Trigger asChild>
      <div>{children}</div>
    </ContextMenuPrimitive.Trigger>
  );
};

const Menu = () => {
  const selectedNodesIds = useAppSelector(selectSelectedNodesIds);
  const selectedNodesCount = Object.keys(selectedNodesIds).length;

  const contextMenuType: ContextMenuType = selectedNodesCount
    ? 'node-menu'
    : 'canvas-menu';

  const ActiveMenu = menus[contextMenuType];
  return <ActiveMenu />;
};

const Root = ({ onContextMenuOpen, children }: RootProps) => {
  return (
    <ContextMenuPrimitive.Root onOpenChange={onContextMenuOpen}>
      {children}
      <ContextMenuPrimitive.Portal>
        <Styled.Content data-testid="context-menu">
          <Menu />
        </Styled.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
};

export default {
  Root,
  Trigger,
};

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { type PropsWithChildren, type ReactNode, useCallback } from 'react';
import { type WSMessage } from 'shared';
import Divider from '@/components/Elements/Divider/Divider';
import Kbd from '@/components/Elements/Kbd/Kbd';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectSelectedNodesIds } from '@/stores/slices/canvas';
import { store } from '@/stores/store';
import * as Styled from './ContextMenu.styled';
import usePageMutation from '@/hooks/usePageMutation';
import { getAddedNodes } from '@/utils/node';

export type ContextMenuType = 'node-menu' | 'canvas-menu';

type RootProps = PropsWithChildren<{
  children: ReactNode;
  onContextMenuOpen: (open: boolean) => void;
}>;

type TriggerProps = ContextMenuPrimitive.ContextMenuTriggerProps;

type NodesMenuWSMessageType = Extract<
  WSMessage['type'],
  | 'nodes-move-to-start'
  | 'nodes-move-to-end'
  | 'nodes-move-backward'
  | 'nodes-move-forward'
  | 'nodes-delete'
>;

type NodesMenuActionKey = Extract<
  keyof typeof canvasActions,
  | 'moveNodesToStart'
  | 'moveNodesToEnd'
  | 'moveNodesBackward'
  | 'moveNodesForward'
  | 'deleteNodes'
>;

const wsNodesActionMap: Record<NodesMenuActionKey, NodesMenuWSMessageType> = {
  moveNodesToStart: 'nodes-move-to-start',
  moveNodesToEnd: 'nodes-move-to-end',
  moveNodesBackward: 'nodes-move-backward',
  moveNodesForward: 'nodes-move-forward',
  deleteNodes: 'nodes-delete',
};

const CanvasMenu = () => {
  const ws = useWebSocket();
  const { updatePage } = usePageMutation();

  const dispatch = useAppDispatch();

  const handleSelectAll = useCallback(() => {
    dispatch(canvasActions.selectAllNodes());
  }, [dispatch]);

  const handlePaste = useCallback(() => {
    dispatch(canvasActions.pasteNodes());

    if (ws.isConnected) {
      const { selectedNodesIds, nodes } = store.getState().canvas.present;
      const nodesIds = Object.keys(selectedNodesIds);

      ws.send({
        type: 'nodes-add',
        data: getAddedNodes(nodes, nodesIds.length),
      });

      updatePage({ nodes });
    }
  }, [ws, updatePage, dispatch]);

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
  const ws = useWebSocket();

  const { updatePage } = usePageMutation();

  const selectedNodesIds = useAppSelector(selectSelectedNodesIds);

  const dispatch = useAppDispatch();

  const dispatchNodesAction = (actionKey: NodesMenuActionKey) => {
    const nodesIds = Object.keys(selectedNodesIds);
    const action = canvasActions[actionKey];

    dispatch(action(nodesIds));

    if (ws.isConnected) {
      const messageType = wsNodesActionMap[actionKey];

      ws.send({ type: messageType, data: nodesIds });

      const currentNodes = store.getState().canvas.present.nodes;
      updatePage({ nodes: currentNodes });
    }
  };

  const handleNodesDuplicate = () => {
    const nodesIds = Object.keys(selectedNodesIds);
    dispatch(canvasActions.duplicateNodes(nodesIds));

    if (ws.isConnected) {
      const currentNodes = store.getState().canvas.present.nodes;

      ws.send({
        type: 'nodes-add',
        data: getAddedNodes(currentNodes, nodesIds.length),
      });

      updatePage({ nodes: currentNodes });
    }
  };

  const handleSelectNone = () => {
    dispatch(canvasActions.setSelectedNodesIds([]));
  };

  const handleCopy = () => {
    dispatch(canvasActions.copyNodes(Object.keys(selectedNodesIds)));
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
        <Styled.Content>
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

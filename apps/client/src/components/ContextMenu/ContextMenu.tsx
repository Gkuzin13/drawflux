import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { type PropsWithChildren, type ReactNode, useCallback } from 'react';
import { type WSMessage } from 'shared';
import Divider from '@/components/Elements/Divider/Divider';
import Kbd from '@/components/Elements/Kbd/Kbd';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { store } from '@/stores/store';
import { sendMessage } from '@/utils/websocket';
import * as Styled from './ContextMenu.styled';
import usePageMutation from '@/hooks/usePageMutation';
import { getAddedNodes } from '@/utils/node';

export type ContextMenuType = 'node-menu' | 'canvas-menu';

type RootProps = PropsWithChildren<{
  selectedNodesCount: number;
  children: ReactNode;
  onContextMenuOpen: (open: boolean) => void;
}>;

type TriggerProps = ContextMenuPrimitive.ContextMenuTriggerProps;

const WSNodesActionMap: Partial<
  Record<
    (typeof canvasActions)[keyof typeof canvasActions]['type'],
    WSMessage['type']
  >
> = {
  'canvas/moveNodesToStart': 'nodes-move-to-start',
  'canvas/moveNodesToEnd': 'nodes-move-to-end',
  'canvas/moveNodesBackward': 'nodes-move-backward',
  'canvas/moveNodesForward': 'nodes-move-forward',
  'canvas/deleteNodes': 'nodes-delete',
};

const CanvasMenu = () => {
  const ws = useWebSocket();
  const { updatePage } = usePageMutation(ws?.pageId ?? '');

  const dispatch = useAppDispatch();

  const handleSelectAll = useCallback(() => {
    dispatch(canvasActions.selectAllNodes());
  }, [dispatch]);

  const handlePaste = useCallback(() => {
    dispatch(canvasActions.pasteNodes());

    if (ws?.isConnected) {
      const { selectedNodesIds, nodes } = store.getState().canvas.present;
      const nodesIds = Object.keys(selectedNodesIds);

      const message: WSMessage = {
        type: 'nodes-add',
        data: getAddedNodes(nodes, nodesIds.length),
      };

      message && sendMessage(ws.connection, message);
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

  const { updatePage } = usePageMutation(ws?.pageId ?? '');

  const { selectedNodesIds } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const dispatchNodesAction = (action: ActionCreatorWithPayload<string[]>) => {
    const nodesIds = Object.keys(selectedNodesIds);

    dispatch(action(nodesIds));

    if (ws?.isConnected) {
      const messageType =
        WSNodesActionMap[action.type as keyof typeof WSNodesActionMap];

      const message =
        messageType && ({ type: messageType, data: nodesIds } as WSMessage);

      message && sendMessage(ws.connection, message);

      const currentNodes = store.getState().canvas.present.nodes;
      updatePage({ nodes: currentNodes });
    }
  };

  const handleNodesDuplicate = () => {
    const nodesIds = Object.keys(selectedNodesIds);
    dispatch(canvasActions.duplicateNodes(nodesIds));

    if (ws?.isConnected) {
      const currentNodes = store.getState().canvas.present.nodes;

      const message: WSMessage = {
        type: 'nodes-add',
        data: getAddedNodes(currentNodes, nodesIds.length),
      };

      message && sendMessage(ws.connection, message);
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
      <Styled.Item
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesToEnd)}
      >
        Bring to front
      </Styled.Item>
      <Styled.Item
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesForward)}
      >
        Bring forward
      </Styled.Item>
      <Styled.Item
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesBackward)}
      >
        Send backward
      </Styled.Item>
      <Styled.Item
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesToStart)}
      >
        Send to back
      </Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item onSelect={handleSelectNone}>Select None</Styled.Item>
      <Divider orientation="horizontal" />
      <Styled.Item
        onSelect={() => dispatchNodesAction(canvasActions.deleteNodes)}
      >
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

const Root = ({
  selectedNodesCount,
  onContextMenuOpen,
  children,
}: RootProps) => {
  const contextMenuType: ContextMenuType = selectedNodesCount
    ? 'node-menu'
    : 'canvas-menu';

  const ActiveMenu = menus[contextMenuType];

  return (
    <ContextMenuPrimitive.Root onOpenChange={onContextMenuOpen}>
      {children}
      <ContextMenuPrimitive.Portal>
        <Styled.Content>
          <ActiveMenu />
        </Styled.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
};

export default {
  Root,
  Trigger,
};

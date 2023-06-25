import * as RadixContextMenu from '@radix-ui/react-context-menu';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { type PropsWithChildren, type ReactNode, useCallback } from 'react';
import {
  type UpdatePageRequestBody,
  type UpdatePageResponse,
  type WSMessage,
} from 'shared';
import { useWebSocket } from '@/contexts/websocket';
import useFetch from '@/hooks/useFetch';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { store } from '@/stores/store';
import { sendMessage } from '@/utils/websocket';
import { Divider } from '../core/Divider/Divider';
import Kbd from '../core/Kbd/Kbd';
import { ContextMenuContent, ContextMenuItem } from './ContextMenuStyled';

export type ContextMenuType = 'node-menu' | 'canvas-menu';

type Props = PropsWithChildren<{
  type: ContextMenuType;
  onContextMenuOpen: (open: boolean) => void;
  children: ReactNode;
}>;

const WSNodesActionMap: Partial<
  Record<
    (typeof canvasActions)[keyof typeof canvasActions]['type'],
    WSMessage['type']
  >
> = {
  'canvas/duplicateNodes': 'nodes-duplicate',
  'canvas/moveNodesToStart': 'nodes-move-to-start',
  'canvas/moveNodesToEnd': 'nodes-move-to-end',
  'canvas/moveNodesBackward': 'nodes-move-backward',
  'canvas/moveNodesForward': 'nodes-move-forward',
};

const CanvasMenu = () => {
  const { nodes } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const handleSelectAll = useCallback(() => {
    const allSelectedNodesIds = nodes.map((node) => node.nodeProps.id);

    dispatch(canvasActions.setSelectedNodesIds(allSelectedNodesIds));
  }, [dispatch, nodes]);

  return (
    <>
      <ContextMenuItem onSelect={handleSelectAll}>Select All</ContextMenuItem>
    </>
  );
};

const NodeMenu = () => {
  const ws = useWebSocket();

  const [{ error }, updatePage] = useFetch<
    UpdatePageResponse,
    UpdatePageRequestBody
  >(
    `/p/${ws?.pageId}`,
    {
      method: 'PATCH',
    },
    { skip: true },
  );

  const { selectedNodesIds } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const dispatchNodesAction = useCallback(
    (action: ActionCreatorWithPayload<string[]>) => {
      const nodesIds = Object.keys(selectedNodesIds);

      dispatch(action(nodesIds));

      if (ws?.isConnected) {
        const messageType =
          WSNodesActionMap[action.type as keyof typeof WSNodesActionMap];

        const message =
          messageType &&
          ({ type: messageType, data: { nodesIds } } as WSMessage);

        message && sendMessage(ws.connection, message);

        const currentNodes = store.getState().canvas.present.nodes;
        updatePage({ nodes: currentNodes });
      }
    },
    [ws, selectedNodesIds, dispatch, updatePage],
  );

  const handleSelectNone = useCallback(() => {
    dispatch(canvasActions.setSelectedNodesIds([]));
  }, [dispatch]);

  return (
    <>
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.duplicateNodes)}
      >
        Duplicate <Kbd>Ctrl + D</Kbd>
      </ContextMenuItem>
      <Divider orientation="horizontal" />
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesToEnd)}
      >
        Bring to front
      </ContextMenuItem>
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesForward)}
      >
        Bring forward
      </ContextMenuItem>
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesBackward)}
      >
        Send backward
      </ContextMenuItem>
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.moveNodesToStart)}
      >
        Send to back
      </ContextMenuItem>
      <Divider orientation="horizontal" />
      <ContextMenuItem onSelect={handleSelectNone}>Select None</ContextMenuItem>
      <Divider orientation="horizontal" />
      <ContextMenuItem
        onSelect={() => dispatchNodesAction(canvasActions.deleteNodes)}
      >
        Delete
        <Kbd>Del</Kbd>
      </ContextMenuItem>
    </>
  );
};

const menus: Record<ContextMenuType, React.FC> = {
  'node-menu': NodeMenu,
  'canvas-menu': CanvasMenu,
};

const ContextMenu = ({ type, onContextMenuOpen, children }: Props) => {
  const ActiveMenu = menus[type] || CanvasMenu;

  return (
    <RadixContextMenu.Root onOpenChange={onContextMenuOpen}>
      <RadixContextMenu.Trigger
        asChild={true}
        style={{
          userSelect: 'none',
          display: 'block',
          position: 'relative',
        }}
      >
        <div>{children}</div>
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <ContextMenuContent>
          <ActiveMenu />
        </ContextMenuContent>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

export default ContextMenu;

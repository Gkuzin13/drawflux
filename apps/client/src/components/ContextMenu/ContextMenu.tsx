import * as RadixContextMenu from '@radix-ui/react-context-menu';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import {
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { Divider } from '../core/Divider/Divider';
import Kbd from '../core/Kbd/Kbd';
import { ContextMenuContent, ContextMenuItem } from './ContextMenuStyled';

type Props = PropsWithChildren<{
  children: ReactNode;
  onContextMenuOpen: (open: boolean) => void;
}>;

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
  const { selectedNodesIds } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const dispatchNodesAction = useCallback(
    (action: ActionCreatorWithPayload<string[]>) => {
      dispatch(action(Object.keys(selectedNodesIds)));
    },
    [dispatch, selectedNodesIds],
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

const ContextMenu = ({ onContextMenuOpen, children }: Props) => {
  const { selectedNodesIds } = useAppSelector(selectCanvas);

  const ActiveMenu = useMemo(() => {
    const nodesSelected = Object.keys(selectedNodesIds).length > 0;

    return nodesSelected ? NodeMenu : CanvasMenu;
  }, [selectedNodesIds]);

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

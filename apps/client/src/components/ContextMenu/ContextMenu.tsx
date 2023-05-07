import type { Vector2d } from 'konva/lib/types';
import { memo, useCallback, useMemo } from 'react';
import { Html } from 'react-konva-utils';
import { Provider as StoreProvider, useStore } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import { contextMenuActions } from '@/stores/slices/contextMenu';
import { nodesActions, selectCurrentNodes } from '@/stores/slices/nodesSlice';
import type { RootState } from '@/stores/store';
import { Divider } from '../core/Divider/Divider';
import { ContextMenuContainer, ContextMenuItem } from './ContextMenuStyled';

export type ContextMenuType = 'node-menu' | 'drawing-canvas-menu';

type Props = {
  type: ContextMenuType;
  position: Vector2d;
  opened: boolean;
};

const DrawingCanvasMenu = () => {
  const nodes = useAppSelector(selectCurrentNodes);
  const { selectedNodesIds } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const areNodesSelected = useMemo(() => {
    return Boolean(Object.keys(selectedNodesIds).length);
  }, [selectedNodesIds]);

  const handleSelectAll = useCallback(() => {
    const allSelectedNodesIds = nodes.map((node) => node.nodeProps.id);

    dispatch(canvasActions.setSelectedNodesIds(allSelectedNodesIds));
    dispatch(contextMenuActions.close());
  }, [dispatch, nodes]);

  const handleSelectNone = useCallback(() => {
    dispatch(canvasActions.setSelectedNodesIds([]));
    dispatch(contextMenuActions.close());
  }, [dispatch]);

  return (
    <>
      <ContextMenuItem onItemClick={handleSelectAll}>
        Select All
      </ContextMenuItem>
      {areNodesSelected && (
        <ContextMenuItem onItemClick={handleSelectNone}>
          Select None
        </ContextMenuItem>
      )}
    </>
  );
};

const NodeMenu = () => {
  const { selectedNodesIds } = useAppSelector(selectCanvas);
  const store = useStore<RootState>();

  const dispatch = useAppDispatch();

  const handleDuplicateNode = useCallback(async () => {
    const nodesToDuplicate = Object.keys(selectedNodesIds);

    dispatch(nodesActions.duplicate(nodesToDuplicate));

    const duplicatedNodes = store
      .getState()
      .nodesHistory.present.nodes.slice(-nodesToDuplicate.length)
      .map((node) => node.nodeProps.id);

    dispatch(canvasActions.setSelectedNodesIds(duplicatedNodes));

    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds, store]);

  const handleDeleteNode = useCallback(() => {
    dispatch(nodesActions.delete(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  const handleBringToFront = useCallback(() => {
    dispatch(nodesActions.moveToEnd(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  const handleBringForward = useCallback(() => {
    dispatch(nodesActions.moveForward(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  const handleSendToBack = useCallback(() => {
    dispatch(nodesActions.moveToStart(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  const handleSendBackward = useCallback(() => {
    dispatch(nodesActions.moveBackward(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  return (
    <>
      <ContextMenuItem onItemClick={handleDuplicateNode}>
        Duplicate
      </ContextMenuItem>
      <Divider type="horizontal" />
      <ContextMenuItem onItemClick={handleBringToFront}>
        Bring to front
      </ContextMenuItem>
      <ContextMenuItem onItemClick={handleBringForward}>
        Bring forward
      </ContextMenuItem>
      <ContextMenuItem onItemClick={handleSendBackward}>
        Send backward
      </ContextMenuItem>
      <ContextMenuItem onItemClick={handleSendToBack}>
        Send to back
      </ContextMenuItem>
      <Divider type="horizontal" />
      <ContextMenuItem onItemClick={handleDeleteNode}>Delete</ContextMenuItem>
    </>
  );
};

const ContextMenu = memo(({ type, position, opened = false }: Props) => {
  const store = useStore();

  const ActiveMenu = useMemo(() => {
    switch (type) {
      case 'node-menu':
        return NodeMenu;
      case 'drawing-canvas-menu':
        return DrawingCanvasMenu;
    }
  }, [type]);

  return (
    <Html
      groupProps={{ ...position }}
      transformFunc={(attrs) => {
        return { ...attrs, scaleX: 1, scaleY: 1 };
      }}
    >
      <StoreProvider store={store}>
        <ContextMenuContainer opened={opened}>
          <ActiveMenu />
        </ContextMenuContainer>
      </StoreProvider>
    </Html>
  );
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;

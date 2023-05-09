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
import Kbd from '../core/Kbd/Kbd';
import Menu from '../core/Menu/Menu';

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
      <Menu.Item onItemClick={handleSelectAll}>Select All</Menu.Item>
      {areNodesSelected && (
        <Menu.Item onItemClick={handleSelectNone}>Select None</Menu.Item>
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
      <Menu.Item onItemClick={handleDuplicateNode} spanned>
        Duplicate <Kbd>Ctrl + D</Kbd>
      </Menu.Item>
      <Divider type="horizontal" />
      <Menu.Item onItemClick={handleBringToFront}>Bring to front</Menu.Item>
      <Menu.Item onItemClick={handleBringForward}>Bring forward</Menu.Item>
      <Menu.Item onItemClick={handleSendBackward}>Send backward</Menu.Item>
      <Menu.Item onItemClick={handleSendToBack}>Send to back</Menu.Item>
      <Divider type="horizontal" />
      <Menu.Item onItemClick={handleDeleteNode} spanned>
        Delete
        <Kbd>Del</Kbd>
      </Menu.Item>
    </>
  );
};

const ContextMenu = memo(({ type, position, opened }: Props) => {
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
      groupProps={{ ...position, visible: opened, listening: opened }}
      transformFunc={(attrs) => {
        return { ...attrs, scaleX: 1, scaleY: 1 };
      }}
    >
      <StoreProvider store={store}>
        <Menu.Dropdown opened={opened}>
          <ActiveMenu />
        </Menu.Dropdown>
      </StoreProvider>
    </Html>
  );
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;

import type { Vector2d } from 'konva/lib/types';
import { memo, useCallback, useMemo } from 'react';
import { Html } from 'react-konva-utils';
import { Provider as StoreProvider, useStore } from 'react-redux';
import type { SelectedNodesIds } from '@/constants/app';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import { contextMenuActions } from '@/stores/slices/contextMenu';
import { nodesActions, selectNodes } from '@/stores/slices/nodesSlice';
import { Divider } from '../core/Divider/Divider';
import Menu from '../core/Menu/Menu';
import { ContextMenuContainer } from './ContextMenuStyled';

export type ContextMenuType = 'node-menu' | 'drawing-canvas-menu';

type Props = {
  type: ContextMenuType;
  position: Vector2d;
  opened: boolean;
};

const DrawingCanvasMenu = () => {
  const { nodes } = useAppSelector(selectNodes).present;

  const dispatch = useAppDispatch();

  const handleSelectAll = useCallback(() => {
    const allSelectedNodesIds: SelectedNodesIds = {};

    for (const node of nodes) {
      allSelectedNodesIds[node.nodeProps.id] = true;
    }

    dispatch(canvasActions.setSelectedNodesIds(allSelectedNodesIds));
    dispatch(contextMenuActions.close());
  }, [dispatch, nodes]);

  const handleSelectNone = useCallback(() => {
    dispatch(canvasActions.setSelectedNodesIds({}));
    dispatch(contextMenuActions.close());
  }, [dispatch]);

  return (
    <>
      <Divider type="horizontal" />
      <Menu.Item onItemClick={handleSelectAll}>Select All</Menu.Item>
      <Menu.Item onItemClick={handleSelectNone}>Select None</Menu.Item>
    </>
  );
};

const NodeMenu = () => {
  const { selectedNodesIds } = useAppSelector(selectCanvas);
  const dispatch = useAppDispatch();

  const handleDeleteNode = useCallback(() => {
    dispatch(nodesActions.delete(Object.keys(selectedNodesIds)));
    dispatch(contextMenuActions.close());
  }, [dispatch, selectedNodesIds]);

  return (
    <>
      <Menu.Item onItemClick={handleDeleteNode}>Delete</Menu.Item>
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

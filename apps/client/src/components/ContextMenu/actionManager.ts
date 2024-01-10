import { useNotifications } from '@/contexts/notifications';
import { useAppDispatch, useAppStore } from '@/stores/hooks';
import { canvasActions } from '@/services/canvas/slice';
import { libraryActions } from '@/services/library/slice';
import type { ContextMenuAction } from './ContextMenu';

function useActionManager() {
  const store = useAppStore();

  const dispatch = useAppDispatch();

  const { addNotification } = useNotifications();

  const dispatchAction = (action: ContextMenuAction) => {
    const state = store.getState().canvas.present;

    switch (action) {
      case 'select-all': {
        return dispatch(canvasActions.selectAllNodes());
      }
      case 'paste-nodes': {
        return dispatch(
          canvasActions.addNodes(state.copiedNodes, {
            duplicate: true,
            selectNodes: true,
          }),
        );
      }
      case 'delete-nodes': {
        const nodesIds = Object.keys(state.selectedNodesIds);
        return dispatch(canvasActions.deleteNodes(nodesIds));
      }
      case 'move-nodes-to-start':
        return dispatch(
          canvasActions.moveNodesToStart(Object.keys(state.selectedNodesIds)),
        );
      case 'move-nodes-to-end':
        return dispatch(
          canvasActions.moveNodesToEnd(Object.keys(state.selectedNodesIds)),
        );
      case 'move-nodes-forward':
        return dispatch(
          canvasActions.moveNodesForward(Object.keys(state.selectedNodesIds)),
        );
      case 'move-nodes-backward': {
        return dispatch(
          canvasActions.moveNodesBackward(Object.keys(state.selectedNodesIds)),
        );
      }
      case 'duplicate-nodes': {
        const nodesToDuplicate = state.nodes.filter(
          ({ nodeProps }) => nodeProps.id in state.selectedNodesIds,
        );

        return dispatch(
          canvasActions.addNodes(nodesToDuplicate, {
            duplicate: true,
            selectNodes: true,
          }),
        );
      }
      case 'select-none': {
        return dispatch(canvasActions.setSelectedNodesIds([]));
      }
      case 'copy-nodes': {
        return dispatch(canvasActions.copyNodes());
      }
      case 'add-to-library': {
        const nodesToAdd = state.nodes.filter(
          (node) => node.nodeProps.id in state.selectedNodesIds,
        );

        addNotification({ title: 'Added to library', type: 'info' });

        return dispatch(libraryActions.addItem(nodesToAdd));
      }
    }
  };

  return dispatchAction;
}

export default useActionManager;

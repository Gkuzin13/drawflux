import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Panels from '@/components/Panels/Panels';
import Loader from '@/components/Elements/Loader/Loader';
import { useAppDispatch, useAppStore } from '@/stores/hooks';
import useAutoFocus from '@/hooks/useAutoFocus/useAutoFocus';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';
import { useWebSocket } from '@/contexts/websocket';
import {
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getPointerRect,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
import { duplicateNodesToRight, mapNodesIds } from '@/utils/node';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions } from '@/services/canvas/slice';
import { TOOLS } from '@/constants/panels/tools';
import { KEYS } from '@/constants/keys';
import * as Styled from './MainLayout.styled';
import type Konva from 'konva';

const DrawingCanvas = lazy(
  () => import('@/components/Canvas/DrawingCanvas/DrawingCanvas'),
);

const MainLayout = () => {
  const [selectedNodesIds, setSelectedNodesIds] = useState<string[]>([]);

  const store = useAppStore();
  const windowSize = useWindowSize();
  const ws = useWebSocket();

  const containerRef = useAutoFocus<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage>(null);

  const dispatch = useAppDispatch();

  const handleNodesSelect = useCallback((nodesIds: string[]) => {
    setSelectedNodesIds(nodesIds);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const state = store.getState().canvas.present;
      const nodes = state.nodes;
      const selectedNodesIds = Object.keys(state.selectedNodesIds);

      const { key, shiftKey, ctrlKey } = event;
      const lowerCaseKey = key.toLowerCase();

      const onCtrlKey = (key: string) => {
        switch (key) {
          case KEYS.A: {
            event.preventDefault();
            dispatch(canvasActions.selectAllNodes());
            break;
          }
          case KEYS.Z: {
            if (ws.isConnected) {
              return;
            }
            const actionKey = shiftKey ? 'redo' : 'undo';
            const action = historyActions[actionKey];

            dispatch(action());
            break;
          }
          case KEYS.D: {
            event.preventDefault();

            const nodesIds = new Set(Object.keys(state.selectedNodesIds));
            const nodesToDuplicate = nodes.filter(({ nodeProps }) =>
              nodesIds.has(nodeProps.id),
            );

            const duplicatedNodes = duplicateNodesToRight(nodesToDuplicate);
            const duplicatedNodesIds = mapNodesIds(duplicatedNodes);

            dispatch(canvasActions.addNodes(duplicatedNodes));
            dispatch(canvasActions.setSelectedNodesIds(duplicatedNodesIds));
            break;
          }
          case KEYS.C: {
            dispatch(canvasActions.copyNodes());
            break;
          }
          case KEYS.V: {
            dispatch(canvasActions.pasteNodes());
            break;
          }
        }
      };

      if (ctrlKey) {
        return onCtrlKey(lowerCaseKey);
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));
        return;
      }

      const toolTypeObj = TOOLS.find((tool) => tool.key === lowerCaseKey);
      toolTypeObj && dispatch(canvasActions.setToolType(toolTypeObj.value));
    },
    [ws, store, dispatch],
  );

  const handleContextMenuOpen = useCallback(
    (open: boolean) => {
      const stage = stageRef.current;
      const pointerPosition = stage?.getPointerPosition();

      if (!stage || !pointerPosition || !open) {
        return;
      }

      const layer = getMainLayer(stage);
      const children = getLayerNodes(layer);

      const selectedNodesIds = store.getState().canvas.present.selectedNodesIds;

      const pointerRect = getPointerRect(pointerPosition, stage.scaleX());
      const nodesInClickArea = getIntersectingNodes(children, pointerRect);

      const multipleNodesSelected = Object.keys(selectedNodesIds).length > 1;
      const clickedOnNodes = Boolean(nodesInClickArea.length);
      const clickedOnSelectedNodes = nodesInClickArea.some(
        (node) => node.id() in selectedNodesIds,
      );

      if (clickedOnNodes && !clickedOnSelectedNodes && !multipleNodesSelected) {
        const nodesIds = nodesInClickArea.map((node) => node.id());
        dispatch(canvasActions.setSelectedNodesIds(nodesIds));
      }
    },
    [stageRef, store, dispatch],
  );

  return (
    <Styled.Container ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <Panels stageRef={stageRef} selectedNodesIds={selectedNodesIds} />
      <ContextMenu.Root onContextMenuOpen={handleContextMenuOpen}>
        <ContextMenu.Trigger>
          <Suspense fallback={<Loader fullScreen>Loading Assets...</Loader>}>
            <DrawingCanvas
              ref={stageRef}
              size={windowSize}
              onNodesSelect={handleNodesSelect}
            />
          </Suspense>
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </Styled.Container>
  );
};

export default MainLayout;

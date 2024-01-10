import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import ContextMenu, {
  type ContextMenuType,
} from '@/components/ContextMenu/ContextMenu';
import Panels from '@/components/Panels/Panels';
import Loader from '@/components/Elements/Loader/Loader';
import { useAppDispatch, useAppStore } from '@/stores/hooks';
import useAutoFocus from '@/hooks/useAutoFocus/useAutoFocus';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';
import { useWebSocket } from '@/contexts/websocket';
import {
  getIntersectingNodes,
  getLayerNodes,
  getLayerTransformers,
  getMainLayer,
  getPointerRect,
  haveIntersection,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
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
  const [menuType, setMenuType] = useState<ContextMenuType>('canvas-menu');
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

            const nodesToDuplicate = state.nodes.filter(
              ({ nodeProps }) => nodeProps.id in state.selectedNodesIds,
            );

            dispatch(
              canvasActions.addNodes(nodesToDuplicate, {
                duplicate: true,
                selectNodes: true,
              }),
            );
            break;
          }
          case KEYS.C: {
            dispatch(canvasActions.copyNodes());
            break;
          }
          case KEYS.V: {
            dispatch(
              canvasActions.addNodes(state.copiedNodes, {
                duplicate: true,
                selectNodes: true,
              }),
            );
            break;
          }
        }
      };

      if (ctrlKey) {
        return onCtrlKey(lowerCaseKey);
      }

      if (key === KEYS.DELETE) {
        dispatch(
          canvasActions.deleteNodes(Object.keys(state.selectedNodesIds)),
        );
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

      const pointerRect = getPointerRect(pointerPosition, stage.scaleX());
      const layer = getMainLayer(stage);
      const layerTransformer = getLayerTransformers(layer)[0];

      if (layerTransformer) {
        const clickedOnTransformer = haveIntersection(
          layerTransformer.getClientRect(),
          pointerRect,
        );

        if (clickedOnTransformer) {
          setMenuType((prevType) => {
            return prevType === 'node-menu' ? prevType : 'node-menu';
          });
          return;
        }
      }

      const layerNodes = getLayerNodes(layer);
      const nodesInClickArea = getIntersectingNodes(layerNodes, pointerRect);
      const clickedOnNodes = Boolean(nodesInClickArea.length);

      if (clickedOnNodes) {
        const nodesIds = nodesInClickArea.map((node) => node.id());
        dispatch(canvasActions.setSelectedNodesIds(nodesIds));
        setMenuType('node-menu');
        return;
      }

      dispatch(canvasActions.setSelectedNodesIds([]));
      setMenuType('canvas-menu');
    },
    [dispatch],
  );

  return (
    <Styled.Container ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <Panels stageRef={stageRef} selectedNodesIds={selectedNodesIds} />
      <ContextMenu.Root
        menuType={menuType}
        onContextMenuOpen={handleContextMenuOpen}
      >
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

import type Konva from 'konva';
import { useCallback, useRef, useState } from 'react';
import DrawingCanvas from '@/components/Canvas/DrawingCanvas/DrawingCanvas';
import {
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getPointerRect,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Panels from '@/components/Panels/Panels';
import { useAppDispatch } from '@/stores/hooks';
import { canvasActions } from '@/stores/slices/canvas';
import * as Styled from './MainLayout.styled';
import { store } from '@/stores/store';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';
import { TOOLS } from '@/constants/panels/tools';
import { KEYS } from '@/constants/keys';
import { getAddedNodes } from '@/utils/node';
import {
  type HistoryActionKey,
  historyActions,
} from '@/stores/reducers/history';
import usePageMutation from '@/hooks/usePageMutation';
import { useWebSocket } from '@/contexts/websocket';
import useAutoFocus from '@/hooks/useAutoFocus/useAutoFocus';

const MainLayout = () => {
  const [selectedNodesIds, setSelectedNodesIds] = useState<string[]>([]);

  const containerRef = useAutoFocus<HTMLDivElement>();

  const windowSize = useWindowSize();
  const ws = useWebSocket();

  const stageRef = useRef<Konva.Stage>(null);

  const dispatch = useAppDispatch();
  const { updatePage } = usePageMutation();

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
            const actionKey: HistoryActionKey = shiftKey ? 'redo' : 'undo';
            const action = historyActions[actionKey];

            dispatch(action());

            if (ws.isConnected) {
              ws.send({ type: 'history-change', data: { action: actionKey } });
            }
            break;
          }
          case KEYS.D: {
            event.preventDefault();

            dispatch(canvasActions.duplicateNodes(selectedNodesIds));

            if (ws.isConnected) {
              ws.send({
                type: 'nodes-add',
                data: getAddedNodes(nodes, selectedNodesIds.length),
              });

              updatePage({ nodes });
            }
            break;
          }
          case KEYS.C: {
            dispatch(canvasActions.copyNodes(selectedNodesIds));
            break;
          }
          case KEYS.V: {
            dispatch(canvasActions.pasteNodes());

            if (ws.isConnected) {
              const pastedNodes = getAddedNodes(nodes, selectedNodesIds.length);

              ws.send({ type: 'nodes-add', data: pastedNodes });

              updatePage({ nodes });
            }
            break;
          }
        }
      };

      if (ctrlKey) {
        return onCtrlKey(lowerCaseKey);
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));

        if (ws.isConnected) {
          ws.send({
            type: 'nodes-delete',
            data: selectedNodesIds,
          });

          updatePage({ nodes });
        }
        return;
      }

      const toolTypeObj = TOOLS.find((tool) => tool.key === lowerCaseKey);
      toolTypeObj && dispatch(canvasActions.setToolType(toolTypeObj.value));
    },
    [ws, updatePage, dispatch],
  );

  const handleContextMenuOpen = useCallback(
    (open: boolean) => {
      const stage = stageRef.current;

      if (!stage || !open) {
        return;
      }

      const pointerPosition = stage.getPointerPosition();

      if (!pointerPosition) {
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
    [stageRef, dispatch],
  );

  return (
    <Styled.Container ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <Panels stageRef={stageRef} selectedNodesIds={selectedNodesIds} />
      <ContextMenu.Root onContextMenuOpen={handleContextMenuOpen}>
        <ContextMenu.Trigger>
          <DrawingCanvas
            ref={stageRef}
            size={windowSize}
            onNodesSelect={handleNodesSelect}
          />
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </Styled.Container>
  );
};

export default MainLayout;

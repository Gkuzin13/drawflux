import type Konva from 'konva';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WSMessage, StageConfig } from 'shared';
import DrawingCanvas from '@/components/Canvas/DrawingCanvas/DrawingCanvas';
import {
  getNodesIntersectingWithRect,
  getPointerRect,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Dialog from '@/components/Elements/Dialog/Dialog';
import Panels from '@/components/Panels/Panels';
import { KEYS } from '@/constants/keys';
import { TOOLS } from '@/constants/panels/tools';
import { NODES_LAYER_INDEX } from '@/constants/shape';
import { useModal } from '@/contexts/modal';
import { useWebSocket } from '@/contexts/websocket';
import useKeyDown from '@/hooks/useKeyDown';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  type HistoryActionKey,
  historyActions,
} from '@/stores/reducers/history';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { sendMessage } from '@/utils/websocket';
import * as Styled from './MainLayout.styled';
import usePageMutation from '@/hooks/usePageMutation';
import { store } from '@/stores/store';
import { getAddedNodes } from '@/utils/node';

type Props = {
  viewportSize: {
    width: number;
    height: number;
  };
};

const MainLayout = ({ viewportSize }: Props) => {
  const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>([]);

  const { stageConfig, selectedNodesIds, nodes } = useAppSelector(selectCanvas);

  const ws = useWebSocket();
  const modal = useModal();

  const { updatePage } = usePageMutation(ws?.pageId ?? '');

  const stageRef = useRef<Konva.Stage>(null);

  const dispatch = useAppDispatch();

  const canvasConfig = useMemo(() => {
    const scale = { x: stageConfig.scale, y: stageConfig.scale };
    return { scale, ...stageConfig.position, ...viewportSize };
  }, [stageConfig, viewportSize]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, shiftKey, ctrlKey } = event;
      const lowerCaseKey = key.toLowerCase();

      if (ctrlKey) {
        switch (lowerCaseKey) {
          case KEYS.A: {
            event.preventDefault();
            dispatch(canvasActions.selectAllNodes());
            return;
          }
          case KEYS.Z: {
            const actionKey: HistoryActionKey = shiftKey ? 'redo' : 'undo';
            const action = historyActions[actionKey];

            dispatch(action());

            if (ws?.isConnected) {
              const message: WSMessage = {
                type: 'history-change',
                data: { action: actionKey },
              };

              sendMessage(ws.connection, message);
            }
            return;
          }
          case KEYS.D: {
            event.preventDefault();

            const nodesIds = Object.keys(selectedNodesIds);

            dispatch(canvasActions.duplicateNodes(nodesIds));

            const currentNodes = store.getState().canvas.present.nodes;

            if (ws?.isConnected) {
              const message: WSMessage = {
                type: 'nodes-add',
                data: getAddedNodes(currentNodes, nodesIds.length),
              };

              sendMessage(ws.connection, message);
              updatePage({ nodes: currentNodes });
            }
            return;
          }
        }
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(Object.keys(selectedNodesIds)));

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-delete',
            data: Object.keys(selectedNodesIds),
          };

          sendMessage(ws.connection, message);

          const currentNodes = store.getState().canvas.present.nodes;
          updatePage({ nodes: currentNodes });
        }
        return;
      }

      const toolTypeObj = TOOLS.find((tool) => tool.key === lowerCaseKey);
      toolTypeObj && dispatch(canvasActions.setToolType(toolTypeObj.value));
    },
    [ws, selectedNodesIds, updatePage, dispatch],
  );

  useKeyDown(stageRef.current?.container(), onKeyDown);

  useEffect(() => {
    setIntersectedNodesIds(Object.keys(selectedNodesIds));
  }, [selectedNodesIds]);

  const handleStageConfigChange = useCallback(
    (config: Partial<StageConfig>) => {
      dispatch(canvasActions.setStageConfig(config));
    },
    [dispatch],
  );

  const handleNodesIntersection = useCallback((nodesIds: string[]) => {
    setIntersectedNodesIds(nodesIds);
  }, []);

  const handleNodesUpdate = useCallback(() => {
    updatePage({ nodes });
  }, [nodes, updatePage]);

  const handleContextMenuOpen = useCallback(
    (open: boolean) => {
      const stage = stageRef.current;

      if (!stage || !nodes.length || !open) {
        return;
      }

      const pointerPosition = stage.getPointerPosition();

      if (!pointerPosition) {
        return;
      }

      const layer = stage.getLayers()[NODES_LAYER_INDEX];

      const pointerRect = getPointerRect(pointerPosition, stageConfig.scale);
      const nodesInClickArea = getNodesIntersectingWithRect(
        layer,
        nodes,
        pointerRect,
      );

      const multipleNodesSelected = intersectedNodesIds.length > 1;
      const clickedOnNodes = !!nodesInClickArea.length;
      const clickedOnSelectedNodes = nodesInClickArea.some((node) =>
        intersectedNodesIds.includes(node.id()),
      );

      if (clickedOnNodes && !clickedOnSelectedNodes && !multipleNodesSelected) {
        dispatch(
          canvasActions.setSelectedNodesIds(
            nodesInClickArea.map((node) => node.id()),
          ),
        );
      }
    },
    [nodes, stageConfig.scale, intersectedNodesIds, dispatch],
  );

  return (
    <Styled.Container tabIndex={0}>
      <Panels intersectedNodesIds={intersectedNodesIds} stageRef={stageRef} />
      <ContextMenu
        selectedNodesCount={Object.keys(selectedNodesIds).length}
        onContextMenuOpen={handleContextMenuOpen}
      >
        <DrawingCanvas
          ref={stageRef}
          config={canvasConfig}
          intersectedNodesIds={intersectedNodesIds}
          onNodesIntersection={handleNodesIntersection}
          onConfigChange={handleStageConfigChange}
          onNodesUpdate={handleNodesUpdate}
        />
      </ContextMenu>
      <Dialog
        open={modal.opened}
        title={modal.title}
        description={modal.description}
        onClose={modal.close}
      />
    </Styled.Container>
  );
};

export default MainLayout;

import type Konva from 'konva';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type StageConfig } from 'shared';
import DrawingCanvas from '@/components/Canvas/DrawingCanvas/DrawingCanvas';
import {
  getIntersectingNodes,
  getPointerRect,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
import type { ContextMenuType } from '@/components/ContextMenu/ContextMenu';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Dialog from '@/components/Elements/Dialog/Dialog';
import Panels from '@/components/Panels/Panels';
import { NODES_LAYER_INDEX } from '@/constants/node';
import { useModal } from '@/contexts/modal';
import useKbdShortcuts from '@/hooks/useKbdShortcuts';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { Container } from './MainLayoutStyled';

type Props = {
  viewportSize: {
    width: number;
    height: number;
  };
};

const MainLayout = ({ viewportSize }: Props) => {
  const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>([]);

  const { stageConfig, selectedNodesIds, nodes, toolType } =
    useAppSelector(selectCanvas);

  const modal = useModal();

  const stageRef = useRef<Konva.Stage>(null);

  const dispatch = useAppDispatch();

  const canvasConfig = useMemo(() => {
    const scale = { x: stageConfig.scale, y: stageConfig.scale };
    return { scale, ...stageConfig.position, ...viewportSize };
  }, [stageConfig, viewportSize]);

  const contextMenuType: ContextMenuType = useMemo(() => {
    return intersectedNodesIds.length ? 'node-menu' : 'canvas-menu';
  }, [intersectedNodesIds.length]);

  useKbdShortcuts(
    stageRef.current?.container() || null,
    intersectedNodesIds,
    toolType,
  );

  useEffect(() => {
    setIntersectedNodesIds(Object.keys(selectedNodesIds));
  }, [selectedNodesIds]);

  const handleStageConfigChange = (config: Partial<StageConfig>) => {
    dispatch(canvasActions.setStageConfig(config));
  };

  const handleNodesIntersection = (nodesIds: string[]) => {
    setIntersectedNodesIds(nodesIds);
  };

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
      const children = layer.getChildren((child) => !!child.id());
      const nodesInClickArea = getIntersectingNodes(children, pointerRect);

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

  const handleDialogClose = () => {
    modal.close();
  };

  return (
    <Container tabIndex={0}>
      <Panels intersectedNodesIds={intersectedNodesIds} stageRef={stageRef} />
      <ContextMenu
        type={contextMenuType}
        onContextMenuOpen={handleContextMenuOpen}
      >
        <DrawingCanvas
          ref={stageRef}
          config={canvasConfig}
          intersectedNodesIds={intersectedNodesIds}
          onNodesIntersection={handleNodesIntersection}
          onConfigChange={handleStageConfigChange}
        />
      </ContextMenu>
      <Dialog
        open={modal.opened}
        title={modal.title}
        description={modal.description}
        onClose={handleDialogClose}
      />
    </Container>
  );
};

export default MainLayout;

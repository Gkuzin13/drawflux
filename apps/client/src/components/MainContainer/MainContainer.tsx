import type Konva from 'konva';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StageConfig } from 'shared';
import Canvas from '@/components/Canvas/Canvas';
import {
  getIntersectingNodes,
  getPointerRect,
} from '@/components/Canvas/helpers/stage';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import type { ContextMenuType } from '@/components/ContextMenu/ContextMenu';
import Dialog from '@/components/core/Dialog/Dialog';
import Loader from '@/components/core/Loader/Loader';
import Panels from '@/components/Panels/Panels';
import { NODES_LAYER_INDEX } from '@/constants/node';
import useKbdShortcuts from '@/hooks/useKbdShortcuts';
import { useGetPageQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { selectDialog, uiActions } from '@/stores/slices/ui';
import { Container } from './MainContainerStyled';

type Props = {
  pageId: string | null;
  viewportSize: {
    width: number;
    height: number;
  };
};

const MainContainer = ({ pageId, viewportSize }: Props) => {
  const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>([]);
  const { isLoading, isError, isSuccess } = useGetPageQuery(
    {
      id: pageId as string,
    },
    { skip: !pageId },
  );

  const { stageConfig, selectedNodesIds, nodes, toolType } =
    useAppSelector(selectCanvas);
  const dialog = useAppSelector(selectDialog);

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

  useEffect(() => {
    if (isError) {
      dispatch(
        uiActions.openDialog({
          title: 'Error',
          description: 'Error loading page',
        }),
      );
    }
  }, [isError, dispatch]);

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
    dispatch(uiActions.closeDialog());
  };

  if (isLoading) {
    return <Loader fullScreen={true}>Loading</Loader>;
  }

  return (
    <Container tabIndex={0}>
      <Panels
        intersectedNodesIds={intersectedNodesIds}
        isPageShared={isSuccess}
        stageRef={stageRef}
      />
      <ContextMenu
        type={contextMenuType}
        onContextMenuOpen={handleContextMenuOpen}
      >
        <Canvas
          ref={stageRef}
          config={canvasConfig}
          intersectedNodesIds={intersectedNodesIds}
          onNodesIntersection={handleNodesIntersection}
          onConfigChange={handleStageConfigChange}
        />
      </ContextMenu>
      <Dialog {...dialog} onClose={handleDialogClose} />
    </Container>
  );
};

export default MainContainer;

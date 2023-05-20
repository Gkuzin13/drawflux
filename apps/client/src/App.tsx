import type Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { StageConfig } from 'shared';
import Canvas from '@/components/Canvas/Canvas';
import {
  getIntersectingNodes,
  getLayerChildren,
  getPointerRect,
} from '@/components/Canvas/helpers/stage';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Dialog from '@/components/core/Dialog/Dialog';
import Loader from '@/components/core/Loader/Loader';
import Panels from '@/components/Panels/Panels';
import {
  LOCAL_STORAGE,
  PAGE_URL_SEARCH_PARAM_KEY,
  PageState,
  type PageStateType,
} from '@/constants/app';
import useKbdShortcuts from '@/hooks/useKbdShortcuts';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';
import { useGetPageQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { uiActions, selectDialog } from '@/stores/slices/ui';
import { storage } from '@/utils/storage';
import { urlSearchParam } from './utils/url';

const App = () => {
  const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>([]);

  const id = useMemo(() => urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY), []);

  const { isLoading, isError, isSuccess } = useGetPageQuery(
    {
      id: id as string,
    },
    { skip: !id },
  );

  const { stageConfig, selectedNodesIds, nodes } = useAppSelector(selectCanvas);
  const dialog = useAppSelector(selectDialog);

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);

  useKbdShortcuts(stageRef.current?.container() || null);

  const [width, height] = useWindowSize();

  useEffect(() => {
    setIntersectedNodesIds(Object.keys(selectedNodesIds));
  }, [selectedNodesIds]);

  useEffect(() => {
    if (id) {
      return;
    }

    const stateFromStorage = storage.get<PageStateType>(LOCAL_STORAGE.KEY);

    if (stateFromStorage) {
      try {
        PageState.parse(stateFromStorage);
      } catch (error) {
        return;
      }

      const { toolType, nodes, stageConfig, selectedNodesIds } =
        stateFromStorage.page;

      dispatch(
        canvasActions.set({ toolType, nodes, selectedNodesIds, stageConfig }),
      );
    }
  }, [id, dispatch]);

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

  const canvasConfig = useMemo(() => {
    return {
      width,
      height,
      scale: { x: stageConfig.scale, y: stageConfig.scale },
      ...stageConfig.position,
    };
  }, [stageConfig, width, height]);

  const handleStageConfigChange = (config: Partial<StageConfig>) => {
    dispatch(canvasActions.setStageConfig(config));
  };

  const handleNodesIntersection = (nodesIds: string[]) => {
    setIntersectedNodesIds(nodesIds);
  };

  const handleContextMenuOpen = (open: boolean) => {
    const stage = stageRef.current;

    if (!stage || !nodes.length || !open) {
      return;
    }

    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition) {
      return;
    }

    const pointerRect = getPointerRect(pointerPosition, stageConfig.scale);
    const multipleNodesSelected = Object.keys(selectedNodesIds).length > 1;

    const children = getLayerChildren(stage.getLayers()[0]);

    const nodesInClickArea = getIntersectingNodes(children, pointerRect);
    const clickedOnNodes = nodesInClickArea.length > 0;
    const clickedOnSelectedNodes = nodesInClickArea.some(
      (node) => selectedNodesIds[node.id()],
    );

    if (clickedOnNodes && !clickedOnSelectedNodes && !multipleNodesSelected) {
      const frontNodeId = nodesInClickArea[nodesInClickArea.length - 1].id();
      dispatch(canvasActions.setSelectedNodesIds([frontNodeId]));
    }
  };

  if (isLoading) {
    return <Loader fullScreen={true}>Loading</Loader>;
  }

  return (
    <>
      <Panels
        intersectedNodesIds={intersectedNodesIds}
        isPageShared={isSuccess}
        stageRef={stageRef}
      />
      <ContextMenu onContextMenuOpen={handleContextMenuOpen}>
        <Canvas
          ref={stageRef}
          config={canvasConfig}
          intersectedNodesIds={intersectedNodesIds}
          onNodesIntersection={handleNodesIntersection}
          onConfigChange={handleStageConfigChange}
        />
      </ContextMenu>
      <Dialog {...dialog} onClose={() => dispatch(uiActions.closeDialog())} />
    </>
  );
};

export default App;

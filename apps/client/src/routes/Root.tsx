import type Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { StageConfig } from 'shared';
import Canvas from '@/components/Canvas/Canvas';
import Loader from '@/components/core/Loader/Loader';
import Modal from '@/components/core/Modal/Modal';
import Panels from '@/components/Panels/Panels';
import { LOCAL_STORAGE, PageState, type PageStateType } from '@/constants/app';
import useKeydownListener from '@/hooks/useKeyListener';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';
import { useGetPageQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { uiActions, selectModal } from '@/stores/slices/ui';
import { storage } from '@/utils/storage';

const Root = () => {
  const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>([]);

  const { id } = useParams();
  const { isLoading, isError, isSuccess } = useGetPageQuery(
    {
      id: id as string, // Temporary workaround
    },
    { skip: !id },
  );

  const { stageConfig, selectedNodesIds } = useAppSelector(selectCanvas);
  const modal = useAppSelector(selectModal);

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);

  useKeydownListener(stageRef);

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
        uiActions.openModal({ title: 'Error', message: 'Error loading page' }),
      );
    }
  }, [isError, dispatch]);

  const drawingCanvasConfig = useMemo(() => {
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
      <Canvas
        ref={stageRef}
        config={drawingCanvasConfig}
        intersectedNodesIds={intersectedNodesIds}
        onNodesIntersection={handleNodesIntersection}
        onConfigChange={handleStageConfigChange}
      />
      {modal.opened && (
        <Modal
          title={modal.title}
          message={modal.message}
          onClose={() => dispatch(uiActions.closeModal())}
        />
      )}
    </>
  );
};

export default Root;

import { useCallback, useRef } from 'react';
import { Layer } from 'react-konva';
import useEvent from '@/hooks/useEvent';
import { useAppDispatch } from '@/stores/hooks';
import { getRelativePointerPosition } from './helpers/stage';
import { safeJSONParse } from '@/utils/object';
import { duplicateNodesAtPosition, mapNodesIds } from '@/utils/node';
import { canvasActions } from '@/stores/slices/canvas';
import { LIBRARY } from '@/constants/panels/library';
import type Konva from 'konva';
import type { LibraryItem } from '@/constants/app';

type Props = {
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Layer>, 'ref'>;

const MainLayer = ({ children, ...props }: Props) => {
  const layerRef = useRef<Konva.Layer>(null);

  const canvasElement = layerRef.current?.getCanvas()._canvas;

  const dispatch = useAppDispatch();

  const handleDrop = useCallback(
    (event: DragEvent) => {
      if (!event.dataTransfer || !layerRef.current) return;

      const stage = layerRef.current.getStage();
      stage.setPointersPositions(event);

      const position = getRelativePointerPosition(stage);

      const dataJSON = event.dataTransfer.getData(LIBRARY.dataTransferFormat);
      const libraryItem = safeJSONParse<LibraryItem>(dataJSON);

      if (libraryItem) {
        const duplicated = duplicateNodesAtPosition(
          libraryItem.elements,
          position,
        );

        dispatch(canvasActions.addNodes(duplicated));
        dispatch(canvasActions.setSelectedNodesIds(mapNodesIds(duplicated)));
        dispatch(canvasActions.setToolType('select'));
      }

      event.preventDefault();
    },
    [dispatch],
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => event.preventDefault(),
    [],
  );

  useEvent('drop', handleDrop, canvasElement);
  useEvent('dragover', handleDragOver, canvasElement);

  return (
    <Layer ref={layerRef} {...props}>
      {children}
    </Layer>
  );
};

export default MainLayer;

import { useCallback, useRef } from 'react';
import { Layer } from 'react-konva';
import useEvent from '@/hooks/useEvent/useEvent';
import { getUnregisteredPointerPosition } from './helpers/stage';
import { safeJSONParse } from '@/utils/object';
import { duplicateNodesAtPosition } from '@/utils/node';
import { LIBRARY } from '@/constants/panels';
import type Konva from 'konva';
import type { LibraryItem } from '@/constants/app';
import type { NodeObject, Point } from 'shared';

type Props = {
  onLibraryItemDrop: (nodes: NodeObject[]) => void;
  onLibraryItemDragOver: (position: Point) => void;
} & Omit<React.ComponentProps<typeof Layer>, 'ref'>;

const MainLayer = ({
  onLibraryItemDrop,
  onLibraryItemDragOver,
  children,
  ...restProps
}: Props) => {
  const layerRef = useRef<Konva.Layer>(null);

  const canvasElement = layerRef.current?.getCanvas()._canvas;

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer || !layerRef.current) return;

      const stage = layerRef.current.getStage();
      const position = getUnregisteredPointerPosition(event, stage);

      const dataJSON = event.dataTransfer.getData(LIBRARY.dataTransferFormat);
      const libraryItem = safeJSONParse<LibraryItem>(dataJSON);

      if (libraryItem) {
        const duplicatedNodes = duplicateNodesAtPosition(
          libraryItem.elements,
          position,
        );

        onLibraryItemDrop(duplicatedNodes);
      }
    },
    [onLibraryItemDrop],
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!layerRef.current) return;

      const stage = layerRef.current.getStage();
      const position = getUnregisteredPointerPosition(event, stage);

      onLibraryItemDragOver(position);
    },
    [onLibraryItemDragOver],
  );

  useEvent('drop', handleDrop, canvasElement);
  useEvent('dragover', handleDragOver, canvasElement);

  return (
    <Layer ref={layerRef} {...restProps}>
      {children}
    </Layer>
  );
};

export default MainLayer;

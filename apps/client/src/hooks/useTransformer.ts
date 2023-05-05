import type Konva from 'konva';
import { type Transformer } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';

const useTransformer = <T extends Konva.Node>(deps: unknown[]) => {
  const nodeRef = useRef<T>(null);
  const transformerRef = useRef<Transformer>(null);

  useEffect(() => {
    if (transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.moveToTop();
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [...deps]);

  return { nodeRef, transformerRef };
};

export default useTransformer;

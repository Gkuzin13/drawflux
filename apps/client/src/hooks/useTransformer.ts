import Konva from 'konva';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';

const useTransformer = <T extends Konva.Node>(deps: any[]) => {
  const nodeRef = useRef<T>(null);
  const transformerRef = useRef<Transformer>(null);

  useEffect(() => {
    if (transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [...deps]);

  return { nodeRef, transformerRef };
};

export default useTransformer;
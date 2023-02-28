import Konva from 'konva';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';

const useTransformer = <T extends Konva.Node>(nodeSelected: boolean) => {
  const nodeRef = useRef<T>(null);
  const transformerRef = useRef<Transformer>(null);

  useEffect(() => {
    if (nodeSelected && transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [nodeSelected]);

  return { nodeRef, transformerRef };
};

export default useTransformer;

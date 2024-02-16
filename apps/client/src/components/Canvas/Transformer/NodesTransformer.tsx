import { memo, useEffect, useRef } from 'react';
import NodeTransformer from './NodeTransformer';
import type Konva from 'konva';
import type { NodeObject } from 'shared';

type Props = {
  selectedNodes: NodeObject[];
  stageScale: number;
  onNodesChange: (nodes: NodeObject[]) => void;
};

const transformerConfig: Konva.TransformerConfig = {
  enabledAnchors: [],
  resizeEnabled: false,
  rotateEnabled: false,
};

const NodesTransformer = ({ selectedNodes, stageScale }: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const layer = transformerRef.current?.getLayer();

    if (transformerRef.current && layer) {
      const elements = selectedNodes
        .map(({ nodeProps }) => layer.findOne(`#${nodeProps.id}`))
        .filter(Boolean) as Konva.Node[];

      transformerRef.current.nodes(elements);
      transformerRef.current.moveToTop();
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNodes]);

  return (
    <NodeTransformer
      ref={transformerRef}
      stageScale={stageScale}
      transformerConfig={transformerConfig}
    />
  );
};

export default memo(NodesTransformer);

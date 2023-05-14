import type Konva from 'konva';
import { useMemo } from 'react';
import type { NodeLine, NodeObject, StageConfig } from 'shared';

type Config = Konva.NodeConfig & Konva.ShapeConfig;

export const baseConfig: Config = {
  lineCap: 'round',
  strokeScaleEnabled: false,
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
  hitStrokeWidth: 12,
  fillEnabled: false,
};

function useNode(
  node: NodeObject,
  stageConfig: StageConfig,
  configOverrides?: Partial<Config>,
) {
  const { scale: stageScale } = stageConfig;

  const scaledLine = useMemo(() => {
    return node.style.line.map((l) => l * stageScale) as NodeLine;
  }, [node.style.line, stageScale]);

  const totalDashLength = useMemo(() => {
    return scaledLine[0] + scaledLine[1];
  }, [scaledLine]);

  const config: Config = useMemo(() => {
    const shapeConfig: Config = {
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: node.style.color,
      strokeWidth: node.style.size * stageScale,
      dash: scaledLine,
      opacity: node.style.opacity,
      listening: node.nodeProps.visible,
    };

    return { ...baseConfig, ...shapeConfig, ...configOverrides };
  }, [node, scaledLine, stageScale]);

  return { totalDashLength, scaledLine, config };
}

export default useNode;

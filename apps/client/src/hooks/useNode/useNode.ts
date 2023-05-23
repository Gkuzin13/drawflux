import type Konva from 'konva';
import { useMemo } from 'react';
import type { NodeObject, StageConfig } from 'shared';
import { getDashValue, getShapeLength } from '@/utils/shape';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type Config = Konva.NodeConfig & Konva.ShapeConfig;
type UseNodeShapeConfig = {
  id: string;
  visible: boolean;
  rotation: number;
  stroke: string;
  strokeWidth: number;
  dash: number[];
  listening: boolean;
};
type UseNodeConfig = typeof baseConfig &
  WithRequired<Config, keyof UseNodeShapeConfig>;

type UseNodeReturn = {
  config: UseNodeConfig;
};

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
): UseNodeReturn {
  const { scale: stageScale } = stageConfig;

  const config = useMemo(() => {
    const shapeConfig: UseNodeConfig = {
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: node.style.color,
      strokeWidth: node.style.size * stageScale,
      opacity: node.style.opacity,
      dash: [],
      listening: node.nodeProps.visible,
    };

    if (!configOverrides || 'dash' in configOverrides === false) {
      const shapeLength = getShapeLength(node);
      const dash = getDashValue(shapeLength, node.style.size, node.style.line);

      shapeConfig.dash = dash.map((d) => d * stageScale);
    }

    return { ...baseConfig, ...shapeConfig, ...configOverrides };
  }, [node, stageScale]);

  return { config };
}

export default useNode;

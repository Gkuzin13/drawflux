import type Konva from 'konva';
import { useMemo } from 'react';
import type { NodeColor, NodeObject, StageConfig, colors } from 'shared';
import { getShapeLength } from '@/utils/math';
import { getColorValue, getDashValue, getSizeValue } from '@/utils/shape';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type Config = Konva.NodeConfig & Konva.ShapeConfig;
type UseNodeShapeConfig = {
  id: string;
  visible: boolean;
  rotation: number;
  stroke: (typeof colors)[NodeColor];
  strokeWidth: number;
  dash: number[];
  listening: boolean;
};

type UseNodeConfig = WithRequired<Config, keyof UseNodeShapeConfig> &
  typeof baseConfig;

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
    const size = getSizeValue(node.style.size);

    const shapeConfig: UseNodeShapeConfig & Config = {
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: getColorValue(node.style.color),
      strokeWidth: size * stageScale,
      opacity: node.style.opacity,
      dash: [],
      listening: node.nodeProps.visible,
    };

    if (
      !configOverrides ||
      ('dash' in configOverrides === false && node.style.line !== 'solid')
    ) {
      const shapeLength = getShapeLength(node);
      const dash = getDashValue(shapeLength, size, node.style.line);

      shapeConfig.dash = dash.map((d) => d * stageScale);
    }

    return { ...baseConfig, ...shapeConfig, ...configOverrides };
  }, [node, stageScale]);

  return { config };
}

export default useNode;

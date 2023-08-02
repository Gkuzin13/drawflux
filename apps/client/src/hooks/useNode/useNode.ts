import type Konva from 'konva';
import { useMemo } from 'react';
import type { NodeColor, NodeObject, colors } from 'shared';
import { getShapeLength } from '@/utils/math';
import {
  getColorValue,
  getDashValue,
  getFillValue,
  getSizeValue,
} from '@/utils/shape';

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
  draggable: true,
};

function useNode(
  node: NodeObject,
  scale: number,
  configOverrides?: Partial<Config>,
): UseNodeReturn {
  const config = useMemo(() => {
    const size = getSizeValue(node.style.size);
    const fillEnabled = (node.style.fill ?? 'none') !== 'none';
    const isFillable = node.type !== 'arrow' && node.type !== 'text';

    const shapeConfig: UseNodeShapeConfig & Config = {
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: getColorValue(node.style.color),
      fill: getFillValue(node.style.fill, node.style.color),
      fillEnabled: fillEnabled && isFillable,
      strokeWidth: size * scale,
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

      shapeConfig.dash = dash.map((d) => d * scale);
    }

    return { ...baseConfig, ...shapeConfig, ...configOverrides };
  }, [node, scale]);

  return { config };
}

export default useNode;

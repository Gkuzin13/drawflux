import { useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import Node from '@/components/Canvas/Node/Node';
import { noop } from '@/utils/is';
import {
  getCanvasCenteredPositionRelativeToNodes,
  getNodesMinMaxPoints,
} from '@/utils/position';
import useForceUpdate from '@/hooks/useForceUpdate/useForceUpdate';
import useEvent from '@/hooks/useEvent';
import * as Styled from './ShapesThumbnail.styled';
import type { NodeObject, ThemeColorValue } from 'shared';
import type Konva from 'konva';

export type ShapesThumbnailStyle = {
  width: number;
  height: number;
  padding: number;
  shapesScale: number;
  backgroundColor: ThemeColorValue;
};

type Props = {
  nodes: NodeObject[];
  draggable?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onClick?: (event: MouseEvent) => void;
} & Partial<ShapesThumbnailStyle>;

const ShapesThumbnail = ({
  nodes,
  draggable,
  width = 0,
  height = 0,
  padding = 0,
  shapesScale = 0,
  backgroundColor,
  onDragStart,
  onDragEnd,
  onClick,
}: Props) => {
  const { forceUpdate } = useForceUpdate();

  const layerRef = useRef<Konva.Layer>(null);

  const canvasElement = layerRef.current?.getCanvas()._canvas;

  useEvent('dragstart', onDragStart, canvasElement);
  useEvent('dragend', onDragEnd, canvasElement);

  useEffect(() => {
    canvasElement?.setAttribute('draggable', draggable ? 'true' : 'false');

    /**
     * temporary fix, otherwise canvasElement is undefined
     */
    forceUpdate();
  }, [draggable, canvasElement, forceUpdate]);

  const { minX, minY, maxX, maxY } = getNodesMinMaxPoints(nodes);

  const paddedWidth = width - 2 * padding;
  const paddedHeight = height - 2 * padding;

  const scale = Math.min(
    paddedWidth / (maxX - minX),
    paddedHeight / (maxY - minY),
  );

  const { x, y } = getCanvasCenteredPositionRelativeToNodes(nodes, {
    width: paddedWidth,
    height: paddedHeight,
    scale,
  });

  return (
    <Styled.Stage
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      x={x + padding}
      y={y + padding}
      listening={false}
      draggable={false}
      css={{ backgroundColor }}
      onClick={onClick}
    >
      <Layer ref={layerRef} listening={false} draggable={false}>
        {nodes.map((node) => {
          return (
            <Node
              key={node.nodeProps.id}
              node={node}
              onNodeChange={noop}
              selected={false}
              stageScale={scale * shapesScale}
            />
          );
        })}
      </Layer>
    </Styled.Stage>
  );
};

export default ShapesThumbnail;

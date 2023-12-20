import { memo, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import Node from '@/components/Canvas/Node/Node';
import useThemeColors from '@/hooks/useThemeColors';
import { noop } from '@/utils/is';
import { getNodesMinMaxPoints } from '@/utils/position';
import useForceUpdate from '@/hooks/useForceUpdate/useForceUpdate';
import useEvent from '@/hooks/useEvent';
import * as Styled from './ShapesThumbnail.styled';
import type { NodeObject } from 'shared';
import type Konva from 'konva';

type Props = {
  nodes: NodeObject[];
  draggable?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
} & Partial<ShapesThumbnailStyle>;

export type ShapesThumbnailStyle = {
  width: number;
  height: number;
  padding: number;
  shapesScale: number;
};

const ShapesThumbnail = ({
  nodes,
  draggable,
  width = 0,
  height = 0,
  padding = 0,
  shapesScale = 0,
  onDragStart,
  onDragEnd,
}: Props) => {
  const { forceUpdate } = useForceUpdate();

  const themeColors = useThemeColors();

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

  const x = -minX * scale + (paddedWidth - (maxX - minX) * scale) / 2 + padding;
  const y =
    -minY * scale + (paddedHeight - (maxY - minY) * scale) / 2 + padding;

  return (
    <Styled.Stage
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      x={x}
      y={y}
      listening={false}
      draggable={false}
      css={{ backgroundColor: themeColors['canvas-bg'].value }}
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

export default memo(ShapesThumbnail);

import {
  Children,
  cloneElement,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { Group, KonvaNodeEvents } from 'react-konva';
import Konva from 'konva';
import { NodeComponentProps } from './types';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import NodeTransformer from './NodeTransformer';
import { CURSOR } from '@/client/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { DragEndEvent } from '@react-types/shared';
import { getStyleValues } from '../shared/element';
import useAnimatedLine from '../shared/hooks/useAnimatedLine';

interface Props extends PropsWithChildren, NodeComponentProps {
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}

type NodeRef = Konva.Circle | Konva.Rect | Konva.Text | Konva.Line;

const NodeContainer = ({
  nodeProps,
  text = null,
  type,
  style,
  selected,
  opacity,
  draggable,
  onNodeChange,
  onSelect,
  onContextMenu,
  transformerConfig,
  transformerEvents,
  children,
}: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRef = useRef<NodeRef>(null);

  const { dash, strokeWidth } = getStyleValues(style);

  useAnimatedLine(
    nodeRef.current,
    dash[0] + dash[1],
    style.animated,
    style.line,
  );

  useEffect(() => {
    if (selected && transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selected]);

  return (
    <>
      {cloneElement(Children.only(children) as ReactElement, {
        ref: nodeRef,
        onClick: onSelect,
        onTap: onSelect,
        dash,
        strokeWidth: type === 'text' ? 0 : strokeWidth,
        stroke: style.color,
        lineCap: 'round',
        opacity,
        draggable: draggable,
        strokeScaleEnabled: false,
        hitStrokeWidth: 12,
        perfectDrawEnabled: false,
        cursorType: CURSOR.ALL_SCROLL,
        fillEnabled: type === 'text',
        onDragEnd: (event: KonvaEventObject<DragEndEvent>) => {
          onNodeChange({
            type,
            text,
            style,
            nodeProps: {
              ...nodeProps,
              x: event.target.x(),
              y: event.target.y(),
            },
          });
        },
      })}
      {selected && (
        <NodeTransformer
          transformerConfig={transformerConfig}
          transformerEvents={transformerEvents}
          ref={transformerRef}
        />
      )}
    </>
  );
};

export default NodeContainer;

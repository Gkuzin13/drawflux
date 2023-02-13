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
import { CURSOR } from '@/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { DragEndEvent } from '@react-types/shared';

interface Props extends PropsWithChildren, NodeComponentProps {
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}

type NodeRef = Konva.Circle | Konva.Rect | Konva.Text | Konva.Line;

const NodeContainer = ({
  nodeProps,
  text = null,
  type,
  isSelected,
  onNodeChange,
  onSelect,
  onContextMenu,
  transformerConfig,
  transformerEvents,
  children,
}: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRef = useRef<NodeRef>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <Group onContextMenu={(e) => onContextMenu(e, nodeProps.id)}>
      {cloneElement(Children.only(children) as ReactElement, {
        ref: nodeRef,
        onClick: onSelect,
        onTap: onSelect,
        strokeScaleEnabled: false,
        hitStrokeWidth: 12,
        perfectDrawEnabled: false,
        cursorType: CURSOR.ALL_SCROLL,
        fillEnabled: type === 'text',
        onDragEnd: (event: KonvaEventObject<DragEndEvent>) => {
          onNodeChange({
            type,
            text,
            nodeProps: {
              ...nodeProps,
              x: event.target.x(),
              y: event.target.y(),
            },
          });
        },
      })}
      {isSelected && (
        <NodeTransformer
          transformerConfig={transformerConfig}
          transformerEvents={transformerEvents}
          ref={transformerRef}
        />
      )}
    </Group>
  );
};

export default NodeContainer;

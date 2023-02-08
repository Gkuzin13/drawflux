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
import { DrawableProps } from './types';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import NodeTransformer from './NodeTransformer';

interface Props extends PropsWithChildren, DrawableProps {
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}

const NodeContainer = ({
  shapeProps,
  text,
  isSelected,
  onChange,
  onSelect,
  onContextMenu,
  transformerConfig,
  transformerEvents,
  children,
}: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Shape>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <Group onContextMenu={(e) => onContextMenu(e, shapeProps.id)}>
      {cloneElement(Children.only(children) as ReactElement, {
        ref: shapeRef,
        onClick: onSelect,
        onTap: onSelect,
        strokeScaleEnabled: false,
        draggable: true,
        onDragEnd: (e: any) => {
          onChange({
            shapeProps: { ...shapeProps, x: e.target.x(), y: e.target.y() },
            text,
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

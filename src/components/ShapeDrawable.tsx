import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { KonvaNodeEvents, Transformer } from 'react-konva';
import Konva from 'konva';
import { DrawableProps } from './types';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';

interface Props extends PropsWithChildren, DrawableProps {
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}

const ShapeDrawable = ({
  shapeProps,
  text,
  isSelected,
  onChange,
  onSelect,
  transformerConfig,
  transformerEvents,
  children,
}: Props) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Shape>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
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
        <Transformer
          ref={trRef}
          ignoreStroke={true}
          anchorStroke="gray"
          anchorFill="gray"
          anchorSize={6}
          anchorCornerRadius={6}
          borderStroke="gray"
          rotationSnaps={[0, 90, 180, 270]}
          shouldOverdrawWholeArea={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            return newBox;
          }}
          {...transformerConfig}
          {...transformerEvents}
        />
      )}
    </>
  );
};

export default ShapeDrawable;

import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { Transformer } from 'react-konva';
import Konva from 'konva';
import { DrawableProps } from './types';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';

interface Props extends PropsWithChildren, DrawableProps {
  transformerConfig?: TransformerConfig;
}

const ShapeDrawable = ({
  shapeProps,
  isSelected,
  onChange,
  onSelect,
  transformerConfig,
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
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return;

        return cloneElement(child, {
          ref: shapeRef,
          onPress: onSelect(shapeProps.id),
          onTap: onSelect(shapeProps.id),
          draggable: true,
          strokeScaleEnabled: false,
          onDragEnd: (e: any) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          },
        } as any);
      })}
      {isSelected && (
        <Transformer
          ref={trRef}
          {...transformerConfig}
          ignoreStroke={true}
          rotationSnaps={[0, 90, 180, 270]}
          shouldOverdrawWholeArea={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ShapeDrawable;

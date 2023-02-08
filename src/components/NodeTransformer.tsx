import Konva from 'konva';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import { ForwardedRef, forwardRef } from 'react';
import { KonvaNodeEvents, Transformer } from 'react-konva';

type Props = {
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
};

const NodeTransformer = forwardRef(
  (
    { transformerConfig, transformerEvents }: Props,
    ref: ForwardedRef<Konva.Transformer>,
  ) => {
    return (
      <Transformer
        ref={ref}
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
    );
  },
);

export default NodeTransformer;

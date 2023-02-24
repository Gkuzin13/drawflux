import { CURSOR } from '@/client/shared/cursor';
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
        anchorFill="white"
        anchorStroke="gray"
        anchorSize={8}
        name="test"
        anchorCornerRadius={6}
        cursorType={CURSOR.ALL_SCROLL}
        borderStroke="gray"
        padding={6}
        rotateAnchorOffset={14}
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

NodeTransformer.displayName = 'NodeTransformer';

export default NodeTransformer;

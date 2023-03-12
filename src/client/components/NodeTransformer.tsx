import Konva from 'konva';
import { TransformerConfig } from 'konva/lib/shapes/Transformer';
import { ForwardedRef, forwardRef } from 'react';
import { KonvaNodeEvents, Transformer } from 'react-konva';
import { theme } from '../shared/styles/theme';

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
        anchorFill={theme.colors.white.value}
        anchorStroke={theme.colors.green300.value}
        borderStroke={theme.colors.gray400.value}
        anchorStrokeWidth={1.5}
        anchorSize={9}
        anchorCornerRadius={5}
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

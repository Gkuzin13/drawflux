import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { TransformerConfig } from 'konva/lib/shapes/Transformer';
import { type PropsWithRef, forwardRef } from 'react';
import { type KonvaNodeEvents, Transformer } from 'react-konva';
import { theme } from 'shared';

type Props = PropsWithRef<{
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}>;

type Ref = Konva.Transformer;

const NodeTransformer = forwardRef<Ref, Props>(
  ({ transformerConfig, transformerEvents }, ref) => {
    const handleDragStart = (event: KonvaEventObject<DragEvent>) => {
      event.target.visible(false);
    };

    const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
      event.target.visible(true);
    };

    return (
      <Transformer
        ref={ref}
        ignoreStroke={true}
        anchorFill={theme.colors.white.value}
        anchorStroke={theme.colors.green300.value}
        borderStroke={theme.colors.green400.value}
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        {...transformerConfig}
        {...transformerEvents}
      />
    );
  },
);

NodeTransformer.displayName = 'NodeTransformer';

export default NodeTransformer;

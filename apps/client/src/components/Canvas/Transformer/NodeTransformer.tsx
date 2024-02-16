import { forwardRef } from 'react';
import { Transformer } from 'react-konva';
import { TRANSFORMER } from '@/constants/shape';
import { normalizeTransformerSize } from './helpers/size';
import useDefaultThemeColors from '@/hooks/useThemeColors';
import type { KonvaNodeEvents } from 'react-konva';
import type Konva from 'konva';
import type { TransformerConfig } from 'konva/lib/shapes/Transformer';

export type TransformerProps = React.PropsWithRef<{
  stageScale: number;
  transformerConfig?: TransformerConfig;
  transformerEvents?: KonvaNodeEvents;
}>;

const NodeTransformer = forwardRef<Konva.Transformer, TransformerProps>(
  ({ transformerConfig, transformerEvents, stageScale }, forwardedRef) => {
    const themeColors = useDefaultThemeColors();

    const handleDragStart = (event: Konva.KonvaEventObject<DragEvent>) => {
      event.target.visible(false);
    };

    const handleDragEnd = (event: Konva.KonvaEventObject<DragEvent>) => {
      event.target.visible(true);
    };

    return (
      <Transformer
        ref={forwardedRef}
        name={TRANSFORMER.NAME}
        type={TRANSFORMER.TYPE}
        anchorFill={themeColors['canvas-bg'].value}
        anchorStroke={TRANSFORMER.BORDER_STROKE}
        borderStroke={TRANSFORMER.BORDER_STROKE}
        anchorStrokeWidth={TRANSFORMER.ANCHOR_STROKE_WIDTH}
        anchorSize={TRANSFORMER.ANCHOR_SIZE}
        anchorCornerRadius={TRANSFORMER.ANCHOR_CORNER_RADIUS}
        padding={TRANSFORMER.PADDING * stageScale}
        rotateAnchorOffset={TRANSFORMER.ROTATION_ANCHOR_OFFSET * stageScale}
        rotationSnaps={TRANSFORMER.ROTATION_SNAPS}
        ignoreStroke={true}
        shouldOverdrawWholeArea={true}
        boundBoxFunc={normalizeTransformerSize}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        rotateAnchorCursor="grab"
        {...transformerConfig}
        {...transformerEvents}
      />
    );
  },
);

NodeTransformer.displayName = 'NodeTransformer';

export default NodeTransformer;

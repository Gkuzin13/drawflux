import type { ToolType } from '@/constants/app';
import type Konva from 'konva';

type CursorType =
  | 'pointer'
  | 'all-scroll'
  | 'grab'
  | 'grabbing'
  | 'crosshair'
  | 'default';

export function setCursor(stage: Konva.Stage | null, cursor: CursorType) {
  if (stage) {
    stage.container().style.cursor = cursor;
  }
}

export function resetCursor(stage: Konva.Stage | null) {
  if (stage) {
    stage.container().style.cursor = '';
  }
}

export function setCursorByToolType(
  stage: Konva.Stage | null,
  toolType: ToolType,
) {
  if (toolType === 'hand') {
    setCursor(stage, 'grab');
  } else if (toolType === 'select') {
    resetCursor(stage);
  } else {
    setCursor(stage, 'crosshair');
  }
}

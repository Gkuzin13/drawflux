import Konva from 'konva';

export function getPointerPosition(stage: Konva.Node) {
  return stage.getStage()?.getPointerPosition();
}

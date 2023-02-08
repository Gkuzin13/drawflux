export type DrawableProps = {
  shapeProps: ShapeProps;
  isSelected: boolean;
  text?: string;
  type: string;
  isDrawable: boolean;
  onSelect: () => void;
  onChange: (args: OnChangeArgs) => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
};

export type OnChangeArgs = Pick<DrawableProps, 'shapeProps' | 'text'>;

export type ShapeProps = {
  id: string;
  points: Point[];
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type Point = {
  x: number;
  y: number;
};

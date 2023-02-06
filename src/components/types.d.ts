export type DrawableProps = {
  shapeProps: ShapeProps;
  isSelected: boolean;
  onSelect: (args: any) => void;
  onChange: (args: ShapeProps) => void;
};

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

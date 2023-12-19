import type { IconBaseProps } from 'react-icons';
import * as Icons from 'react-icons/tb';

export type IconName = keyof typeof ICONS;
export type IconSize = keyof typeof SIZE;
export type IconStroke = keyof typeof STROKE;

export type IconProps = {
  name: IconName;
  stroke?: IconStroke | number;
  size?: IconSize;
} & Omit<IconBaseProps, 'stroke' | 'size'>;

const ICONS = {
  arrowBackUp: Icons.TbArrowBackUp,
  arrowForwardUp: Icons.TbArrowForwardUp,
  arrowUpRight: Icons.TbArrowUpRight,
  trash: Icons.TbTrash,
  fileDownload: Icons.TbFileDownload,
  fileUpload: Icons.TbFileUpload,
  photoDown: Icons.TbPhotoDown,
  circleFilled: Icons.TbCircleFilled,
  circle: Icons.TbCircle,
  filledNone: Icons.TbLayersIntersect,
  filledSemi: Icons.TbLayersSubtract,
  filledSolid: (props: IconBaseProps) =>
    Icons.TbSquaresFilled({ transform: 'rotate(-90)', ...props }),
  lineDashed: Icons.TbLineDashed,
  lineDotted: Icons.TbLineDotted,
  plus: Icons.TbPlus,
  minus: Icons.TbMinus,
  slash: Icons.TbSlash,
  handStop: Icons.TbHandStop,
  pointer: Icons.TbPointer,
  scribble: Icons.TbScribble,
  square: Icons.TbSquare,
  text: Icons.TbTypography,
  x: Icons.TbX,
  shapeSize: Icons.TbSlash,
  spinner: Icons.TbLoader2,
  dots: Icons.TbDots,
  link: Icons.TbLink,
  copy: Icons.TbCopy,
  clipboardCheck: Icons.TbClipboardCheck,
  users: Icons.TbUsers,
  check: Icons.TbCheck,
  pencil: Icons.TbPencil,
  moon: Icons.TbMoon,
  moonStars: Icons.TbMoonStars,
  laser: Icons.TbNorthStar,
  book: Icons.TbBook
} as const;

const SIZE = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

const STROKE = {
  sm: 1.5,
  md: 1.75,
  lg: 2,
  xl: 2.5,
};

const Icon = (props: IconProps) => {
  const { name, stroke, size, ...rest } = props;

  const Icon = ICONS[name];

  const sizeValue = SIZE[size ?? 'md'];
  const strokeValue =
    typeof stroke === 'number' ? stroke : STROKE[stroke ?? 'md'];

  return <Icon size={sizeValue} strokeWidth={strokeValue} {...rest} />;
};

export default Icon;

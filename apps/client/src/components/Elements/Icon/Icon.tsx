import * as Icons from 'react-icons/tb';
import ExtraLarge from './ExtraLarge/ExtraLarge';
import FilledSolid from './FilledSolid/FilledSolid';
import { getIconSize, getIconStrokeWidth } from './getIconProps';
import type { SIZE, STROKE } from './getIconProps';
import type { IconBaseProps } from 'react-icons';

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
  filledSolid: FilledSolid,
  lineDashed: Icons.TbLineDashed,
  lineDotted: Icons.TbLineDotted,
  plus: Icons.TbPlus,
  minus: Icons.TbMinus,
  handStop: Icons.TbHandStop,
  pointer: Icons.TbPointer,
  scribble: Icons.TbScribble,
  square: Icons.TbSquare,
  text: Icons.TbTypography,
  x: Icons.TbX,
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
  book: Icons.TbBook,
  letterS: Icons.TbLetterS,
  letterM: Icons.TbLetterM,
  letterL: Icons.TbLetterL,
  extraLarge: ExtraLarge,
  arrowNarrowRight: Icons.TbArrowNarrowRight,
  arrowNarrowLeft: Icons.TbArrowNarrowLeft,
} as const;

const Icon = (props: IconProps) => {
  const { name, stroke, size, ...rest } = props;

  const sizeValue = getIconSize(size);
  const strokeValue = getIconStrokeWidth(stroke);

  const Component = ICONS[name];

  return (
    <Component
      size={sizeValue}
      strokeWidth={strokeValue}
      data-testid={`${name}-icon`}
      {...rest}
    />
  );
};

export default Icon;

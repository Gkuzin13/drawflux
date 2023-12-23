import { type ThemeColorKey, styled } from 'shared';
import type { TextComponentType } from './Text';

/**
 * temporary solution to passing color prop without creating variables
 * for all colors
 */
export const Root = (as: TextComponentType, color: ThemeColorKey) =>
  styled(as, {
    display: 'block',
    color: `$${color}`,
    lineHeight: 1,
    variants: {
      size: {
        xs: {
          fontSize: '$1',
        },
        sm: {
          fontSize: '$2',
        },
        md: {
          fontSize: '$3',
        },
        lg: {
          fontSize: '$4',
        },
        xl: {
          fontSize: '$5',
        },
        xxl: {
          fontSize: '$6',
        },
      },
      align: {
        left: {
          textAlign: 'left',
        },
        center: {
          textAlign: 'center',
        },
        right: {
          textAlign: 'right',
        },
      },
      weight: {
        light: {
          fontWeight: 'lighter',
        },
        regular: {
          fontWeight: 'normal',
        },
        medium: {
          fontWeight: 'bold',
        },
        bold: {
          fontWeight: 'bolder',
        }
      },
    },
    defaultVariants: {
      size: 'md',
    },
  });

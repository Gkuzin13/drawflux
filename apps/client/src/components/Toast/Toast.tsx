import type { ComponentProps } from '@stitches/react';
import type { PropsWithChildren } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import Button from '../core/Button/Button';
import {
  ToastRoot,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  ToastClose,
} from './ToastStyled';

type Props = ComponentProps<typeof ToastRoot> &
  PropsWithChildren<{
    title?: string;
    description?: string;
  }>;

const Toast = ({ title, description, children, ...props }: Props) => {
  return (
    <>
      <ToastRoot {...props}>
        {title && (
          <ToastTitle asChild>
            <span>{title}</span>
          </ToastTitle>
        )}
        {description && (
          <ToastDescription asChild>
            <span>{description}</span>
          </ToastDescription>
        )}
        <ToastClose asChild>
          <Button
            title="Close"
            color="secondary-light"
            size="extra-small"
            squared
          >
            <IoCloseOutline size={ICON_SIZES.SMALL} />
          </Button>
        </ToastClose>
      </ToastRoot>
      <ToastViewport />
    </>
  );
};

export default Toast;

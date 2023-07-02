import type { ComponentProps } from '@stitches/react';
import type { PropsWithChildren } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import Button from '@/components/Elements/Button/Button';
import { ICON_SIZES } from '@/constants/icon';
import * as Styled from './Toast.styled';

type Props = ComponentProps<typeof Styled.Container> &
  PropsWithChildren<{
    title?: string;
    description?: string;
  }>;

const Toast = ({ title, description, children, ...props }: Props) => {
  return (
    <>
      <Styled.Container {...props}>
        {title && (
          <Styled.Title asChild>
            <span>{title}</span>
          </Styled.Title>
        )}
        {description && (
          <Styled.Description asChild>
            <span>{description}</span>
          </Styled.Description>
        )}
        <Styled.Close asChild>
          <Button
            title="Close"
            color="secondary-light"
            size="extra-small"
            squared
          >
            <IoCloseOutline size={ICON_SIZES.SMALL} />
          </Button>
        </Styled.Close>
      </Styled.Container>
      <Styled.Viewport />
    </>
  );
};

export default Toast;

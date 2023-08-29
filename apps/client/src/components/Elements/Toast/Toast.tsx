import type { ComponentProps } from '@stitches/react';
import type { PropsWithChildren } from 'react';
import Button from '@/components/Elements/Button/Button';
import Icon from '@/components/Elements/Icon/Icon';
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
          <Button title="Close" color="secondary-light" size="xs" squared>
            <Icon name="x" size="sm" />
          </Button>
        </Styled.Close>
      </Styled.Container>
      <Styled.Viewport />
    </>
  );
};

export default Toast;

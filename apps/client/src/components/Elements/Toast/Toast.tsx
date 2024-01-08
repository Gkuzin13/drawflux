import Button from '@/components/Elements/Button/Button';
import Icon from '@/components/Elements/Icon/Icon';
import Text from '../Text/Text';
import * as Styled from './Toast.styled';
import type { ComponentProps } from '@stitches/react';
import type { PropsWithChildren } from 'react';

type Props = ComponentProps<typeof Styled.Container> &
  PropsWithChildren<{
    title?: string;
    description?: string;
  }>;

const Toast = ({ title, description, children, ...props }: Props) => {
  return (
    <>
      <Styled.Container {...props}>
        <Styled.Content>
          {title && (
            <Styled.Title asChild>
              <Text weight="bold">{title}</Text>
            </Styled.Title>
          )}
          {description && (
            <Styled.Description asChild>
              <Text size="xs">{description}</Text>
            </Styled.Description>
          )}
        </Styled.Content>
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

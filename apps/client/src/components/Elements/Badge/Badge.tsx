import * as Styled from './Badge.styled';

type ContentProps = Omit<
  React.ComponentProps<(typeof Styled)['Content']>,
  'content'
>;

type Props = {
  content: string | number;
  isInvisible?: boolean;
  children: React.ReactNode;
} & ContentProps;

const Badge = ({ content, isInvisible, children, ...restProps }: Props) => {
  return (
    <Styled.Container>
      {children}
      <Styled.Content invisible={isInvisible} {...restProps}>
        {content}
      </Styled.Content>
    </Styled.Container>
  );
};

export default Badge;

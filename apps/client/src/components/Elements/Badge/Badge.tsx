import * as Styled from './Badge.styled';

type Props = {
  content: string | number;
  isInvisible?: boolean;
  children: React.ReactNode;
};

const Badge = ({ content, isInvisible, children }: Props) => {
  return (
    <Styled.Container>
      {children}
      <Styled.Content invisible={isInvisible}>{content}</Styled.Content>
    </Styled.Container>
  );
};

export default Badge;

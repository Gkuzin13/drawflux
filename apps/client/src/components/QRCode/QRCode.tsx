import * as Styled from './QRCode.styled';

type Props = {
  dataUrl: string;
};

const QRCode = ({ dataUrl }: Props) => {
  return <Styled.Background style={{ backgroundImage: `url(${dataUrl})` }} />;
};

export default QRCode;

import { QRCodeBgImage } from './QRCodeStyled';

type Props = {
  dataUrl: string;
};

const QRCode = ({ dataUrl }: Props) => {
  return <QRCodeBgImage style={{ backgroundImage: `url(${dataUrl})` }} />;
};

export default QRCode;

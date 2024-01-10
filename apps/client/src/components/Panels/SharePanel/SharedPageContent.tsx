import { Suspense, lazy } from 'react';
import Button from '@/components/Elements/Button/Button';
import Loader from '@/components/Elements/Loader/Loader';
import Icon from '@/components/Elements/Icon/Icon';
import Text from '@/components/Elements/Text/Text';
import useClipboard from '@/hooks/useClipboard/useClipboard';
import * as Styled from './SharePanel.styled';
import type { QRCodeResponse } from 'shared';

type Props = {
  qrCode: QRCodeResponse | null;
  error: string | null;
};

const QRCode = lazy(() => import('@/components/Elements/QRCode/QRCode'));

const SharedPageContent = ({ qrCode, error }: Props) => {
  const { copied, copy } = useClipboard();

  const handleCopyLinkClick = () => {
    if (qrCode) {
      copy(window.location.href);
    }
  };

  return (
    <>
      <Styled.QRCodeContainer>
        <Suspense fallback={<Loader filled />}>
          {qrCode && <QRCode dataUrl={qrCode.dataUrl} />}
          {error && (
            <Text as="p" size="xs" color="gray500">
              Error loading QR Code
            </Text>
          )}
        </Suspense>
      </Styled.QRCodeContainer>
      <Button
        title="Copy link"
        align="between"
        color="secondary-light"
        size="xs"
        onClick={handleCopyLinkClick}
      >
        Copy Link
        <Icon name={copied ? 'clipboardCheck' : 'copy'} />
      </Button>
      <Text as="p" size="xs" color="gray500" lineHeight="normal">
        Anyone with the link has access to this project for 24 hours since sharing.
      </Text>
    </>
  );
};

export default SharedPageContent;

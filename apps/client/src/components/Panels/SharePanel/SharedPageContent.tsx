import { Suspense, lazy } from 'react';
import { TbClipboardCheck, TbCopy } from 'react-icons/tb';
import type { QRCodeResponse } from 'shared';
import Button from '@/components/Elements/Button/Button';
import Loader from '@/components/Elements/Loader/Loader';
import { ICON_SIZES } from '@/constants/icon';
import useClipboard from '@/hooks/useClipboard/useClipboard';
import { QRCodeContainer, SharePanelInfo } from './SharePanelStyled';

type Props = {
  qrCode: QRCodeResponse | null;
  error: string | null;
};

const QRCode = lazy(() => import('@/components/QRCode/QRCode'));

const SharedPageContent = ({ qrCode, error }: Props) => {
  const { copied, copy } = useClipboard();

  const handleCopyLinkClick = async () => {
    if (qrCode) {
      copy(window.location.href);
    }
  };

  return (
    <>
      <QRCodeContainer>
        <Suspense fallback={<Loader filled />}>
          {qrCode && <QRCode dataUrl={qrCode.dataUrl} />}
          {error && <p>Error loading QR Code</p>}
        </Suspense>
      </QRCodeContainer>
      <Button
        title={copied ? 'Link Copied' : 'Copy link'}
        align="between"
        color="secondary-light"
        size="extra-small"
        onClick={handleCopyLinkClick}
      >
        Copy Link
        {!copied ? (
          <TbCopy size={ICON_SIZES.MEDIUM} />
        ) : (
          <TbClipboardCheck size={ICON_SIZES.MEDIUM} />
        )}
      </Button>
      <SharePanelInfo>
        Anyone with the link has access to this page for 24 hours since sharing.
      </SharePanelInfo>
    </>
  );
};

export default SharedPageContent;

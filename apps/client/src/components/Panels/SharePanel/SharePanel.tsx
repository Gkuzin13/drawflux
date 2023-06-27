import * as Popover from '@radix-ui/react-popover';
import { useEffect } from 'react';
import { TbClipboardCheck, TbCopy, TbLink } from 'react-icons/tb';
import type {
  QRCodeRequestBody,
  QRCodeResponse,
  SharePageRequestBody,
  SharePageResponse,
} from 'shared';
import Button from '@/components/core/Button/Button';
import { Divider } from '@/components/core/Divider/Divider';
import Loader from '@/components/core/Loader/Loader';
import QRCode from '@/components/QRCode/QRCode';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { ICON_SIZES } from '@/constants/icon';
import useClipboard from '@/hooks/useClipboard/useClipboard';
import useFetch from '@/hooks/useFetch';
import { urlSearchParam } from '@/utils/url';
import {
  QRCodeContainer,
  SharePanelContent,
  SharePanelDisclamer,
  SharePanelTrigger,
} from './SharePanelStyled';

type Props = {
  pageState: SharePageRequestBody;
  isPageShared: boolean;
};

type ShareablePageProps = {
  page: SharePageRequestBody['page'];
};

type SharedPageContentProps = {
  qrCode?: QRCodeResponse;
  loading: boolean;
  error: string | null;
};

const SharedPageContent = ({
  qrCode,
  loading,
  error,
}: SharedPageContentProps) => {
  const { copied, copy } = useClipboard();

  const handleCopyLinkClick = async () => {
    if (qrCode) {
      copy(window.location.href);
    }
  };

  return (
    <>
      <QRCodeContainer>
        {loading && <Loader filled />}
        {qrCode && <QRCode dataUrl={qrCode.dataUrl} />}
        {error && <p>Error loading QR Code</p>}
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
      <SharePanelDisclamer>
        Anyone with the link has access to this page for 24 hours since sharing.
      </SharePanelDisclamer>
    </>
  );
};

const SharablePageContent = ({ page }: ShareablePageProps) => {
  const [{ data, status }, sharePage] = useFetch<
    SharePageResponse,
    SharePageRequestBody
  >(
    '/p',
    {
      method: 'POST',
    },
    { skip: true },
  );

  useEffect(() => {
    if (data?.id) {
      const updatedURL = urlSearchParam.set(PAGE_URL_SEARCH_PARAM_KEY, data.id);

      window.history.pushState({}, '', updatedURL);
      window.location.reload();
      return;
    }
  }, [data]);

  const handlePageShare = () => {
    if (!page.nodes.length) {
      return;
    }

    sharePage({ page });
  };

  return (
    <>
      <Button
        align="start"
        color="secondary-light"
        size="extra-small"
        disabled={!page.nodes.length}
        onClick={handlePageShare}
      >
        {status === 'idle' && <TbLink size={ICON_SIZES.SMALL} />}
        {status === 'loading' || status === 'success' ? (
          <Loader />
        ) : (
          'Share this page'
        )}
      </Button>
      <Divider orientation="horizontal" />
      <SharePanelDisclamer>
        Sharing this project will make it available for 24 hours publicly to
        anyone who has access to the provided URL.
      </SharePanelDisclamer>
    </>
  );
};

const SharePanel = ({ pageState, isPageShared }: Props) => {
  const [{ data, status, error }, getQRCode] = useFetch<
    QRCodeResponse,
    QRCodeRequestBody
  >('/qrcode', { method: 'POST' }, { skip: true });

  const url = window.location.href;

  const handlePopoverOpen = (open: boolean) => {
    if (isPageShared && !data && open) {
      getQRCode({ url });
    }
  };

  return (
    <Popover.Root onOpenChange={handlePopoverOpen}>
      <SharePanelTrigger>Share</SharePanelTrigger>
      <Popover.Portal>
        <SharePanelContent align="end" sideOffset={4}>
          {isPageShared && data ? (
            <SharedPageContent
              qrCode={data}
              loading={status === 'loading'}
              error={error}
            />
          ) : (
            <SharablePageContent page={pageState.page} />
          )}
        </SharePanelContent>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SharePanel;

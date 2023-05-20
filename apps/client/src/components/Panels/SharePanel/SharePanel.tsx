import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { TbClipboardCheck, TbCopy, TbLink } from 'react-icons/tb';
import type { GetQRCodeResponse, SharePageParams } from 'shared';
import Button from '@/components/core/Button/Button';
import { Divider } from '@/components/core/Divider/Divider';
import Loader from '@/components/core/Loader/Loader';
import QRCode from '@/components/QRCode/QRCode';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { ICON_SIZES } from '@/constants/icon';
import useClipboard from '@/hooks/useClipboard/useClipboard';
import { useGetQRCodeMutation, useSharePageMutation } from '@/services/api';
import { urlSearchParam } from '@/utils/url';
import {
  QRCodeContainer,
  SharePanelContent,
  SharePanelDisclamer,
  SharePanelTrigger,
} from './SharePanelStyled';

type Props = {
  pageState: SharePageParams;
  isPageShared: boolean;
};

type ShareablePageProps = {
  page: SharePageParams['page'];
};

type SharedPageContentProps = {
  qrCode?: GetQRCodeResponse;
  onQRCodeFetchSuccess: (data: GetQRCodeResponse) => void;
};

const SharedPageContent = ({
  qrCode,
  onQRCodeFetchSuccess,
}: SharedPageContentProps) => {
  const [getQRCode, { isLoading, isError }] = useGetQRCodeMutation();
  const { copied, copy } = useClipboard();

  useEffect(() => {
    async function fetchQRCode(url: string) {
      const { data } = await getQRCode({ url }).unwrap();

      if (data?.dataUrl) {
        onQRCodeFetchSuccess(data);
      }
    }

    if (!qrCode) {
      fetchQRCode(window.location.href);
    }
  }, [qrCode, getQRCode, onQRCodeFetchSuccess]);

  const handleCopyLinkClick = async () => {
    if (!qrCode) {
      return;
    }

    copy(window.location.href);
  };

  return (
    <>
      <QRCodeContainer>
        {isLoading && <Loader filled />}
        {qrCode && <QRCode dataUrl={qrCode.dataUrl} />}
        {isError && <p>Error loading QR Code</p>}
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
  const [sharePage, { isLoading, isSuccess }] = useSharePageMutation();

  const handlePageShare = async () => {
    if (!page.nodes.length) {
      return;
    }

    const { data } = await sharePage({ page }).unwrap();

    if (data?.id) {
      const updatedURL = urlSearchParam.set(PAGE_URL_SEARCH_PARAM_KEY, data.id);

      window.history.pushState({}, '', updatedURL);
      window.location.reload();
      return;
    }
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
        {!isLoading && !isSuccess && <TbLink size={ICON_SIZES.SMALL} />}
        {isLoading || isSuccess ? <Loader /> : 'Share this page'}
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
  const [linkQRCode, setLinkQRCode] = useState<GetQRCodeResponse>();

  return (
    <Popover.Root>
      <SharePanelTrigger>Share</SharePanelTrigger>
      <Popover.Portal>
        <SharePanelContent align="end">
          {isPageShared ? (
            <SharedPageContent
              qrCode={linkQRCode}
              onQRCodeFetchSuccess={(data) => setLinkQRCode(data)}
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

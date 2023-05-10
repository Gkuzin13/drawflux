import { useEffect, useState } from 'react';
import { TbClipboardCheck, TbCopy, TbLink } from 'react-icons/tb';
import type { GetQRCodeResponse, SharePageParams } from 'shared';
import Loader from '@/components/core/Loader/Loader';
import Menu from '@/components/core/Menu/Menu';
import QRCode from '@/components/QRCode/QRCode';
import { ICON_SIZES } from '@/constants/icon';
import useClipboard from '@/hooks/useClipboard/useClipboard';
import { useGetQRCodeMutation, useSharePageMutation } from '@/services/api';
import {
  QRCodeContainer,
  SharePanelContainer,
  SharePanelDisclamer,
  SharePanelToggle,
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

  const pageUrl = window.location.href;

  useEffect(() => {
    async function fetchQRCode(url: string) {
      const { data } = await getQRCode({ url }).unwrap();

      if (data?.dataUrl) {
        onQRCodeFetchSuccess(data);
      }
    }

    if (!qrCode) {
      fetchQRCode(pageUrl);
    }
  }, [pageUrl, qrCode, getQRCode, onQRCodeFetchSuccess]);

  const handleCopyLinkClick = async () => {
    if (!pageUrl) {
      return;
    }

    copy(pageUrl);
  };

  return (
    <>
      <QRCodeContainer>
        {isLoading && <Loader filled />}
        {qrCode && <QRCode dataUrl={qrCode.dataUrl} />}
        {isError && <p>Error loading QR Code</p>}
      </QRCodeContainer>
      <Menu.Item
        title={copied ? 'Link Copied' : 'Copy link'}
        size="extra-small"
        spanned
        closeOnItemClick={false}
        onItemClick={handleCopyLinkClick}
      >
        {!copied ? 'Copy link' : 'Link Copied'}
        {!copied ? (
          <TbCopy size={ICON_SIZES.MEDIUM} />
        ) : (
          <TbClipboardCheck size={ICON_SIZES.MEDIUM} />
        )}
      </Menu.Item>
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
      window.history.pushState({}, '', `/p/${data.id}`);
      window.location.reload();
      return;
    }
  };

  return (
    <>
      <Menu.Item
        fullWidth={true}
        size="small"
        disabled={!page.nodes.length}
        color="secondary-light"
        closeOnItemClick={false}
        onItemClick={handlePageShare}
      >
        {!isLoading && <TbLink />}
        {isLoading || isSuccess ? <Loader /> : 'Share this page'}
      </Menu.Item>
      <Menu.Divider type="horizontal" />
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
    <SharePanelContainer>
      <Menu>
        <SharePanelToggle color="primary">Share</SharePanelToggle>
        <Menu.Dropdown>
          {isPageShared ? (
            <SharedPageContent
              qrCode={linkQRCode}
              onQRCodeFetchSuccess={(data) => setLinkQRCode(data)}
            />
          ) : (
            <SharablePageContent page={pageState.page} />
          )}
        </Menu.Dropdown>
      </Menu>
    </SharePanelContainer>
  );
};

export default SharePanel;

import * as Popover from '@radix-ui/react-popover';
import type {
  QRCodeRequestBody,
  QRCodeResponse,
  SharePageRequestBody,
} from 'shared';
import useFetch from '@/hooks/useFetch';
import ShareablePageContent from './ShareablePageContent';
import SharedPageContent from './SharedPageContent';
import { SharePanelContent, SharePanelTrigger } from './SharePanelStyled';

type Props = {
  pageState: SharePageRequestBody;
  isPageShared: boolean;
};

const SharePanel = ({ pageState, isPageShared }: Props) => {
  const [{ data, error }, getQRCode] = useFetch<
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
          {isPageShared ? (
            <SharedPageContent qrCode={data} error={error} />
          ) : (
            <ShareablePageContent page={pageState.page} />
          )}
        </SharePanelContent>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SharePanel;

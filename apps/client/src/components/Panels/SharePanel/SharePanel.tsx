import * as PopoverPrimitive from '@radix-ui/react-popover';
import type {
  QRCodeRequestBody,
  QRCodeResponse,
  SharePageRequestBody,
} from 'shared';
import useFetch from '@/hooks/useFetch';
import ShareablePageContent from './ShareablePageContent';
import SharedPageContent from './SharedPageContent';
import * as Styled from './SharePanel.styled';

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
    <PopoverPrimitive.Root onOpenChange={handlePopoverOpen}>
      <Styled.Trigger>Share</Styled.Trigger>
      <PopoverPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4}>
          {isPageShared ? (
            <SharedPageContent qrCode={data} error={error} />
          ) : (
            <ShareablePageContent page={pageState.page} />
          )}
        </Styled.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default SharePanel;

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { memo } from 'react';
import type { QRCodeRequestBody, QRCodeResponse } from 'shared';
import useFetch from '@/hooks/useFetch';
import ShareablePageContent from './ShareablePageContent';
import SharedPageContent from './SharedPageContent';
import * as Styled from './SharePanel.styled';

type Props = {
  isPageShared: boolean;
};

const SharePanel = ({ isPageShared }: Props) => {
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
            <ShareablePageContent />
          )}
        </Styled.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default memo(SharePanel);

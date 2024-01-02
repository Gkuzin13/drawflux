import { memo, useState } from 'react';
import api from '@/services/api';
import ShareablePageContent from './ShareablePageContent';
import SharedPageContent from './SharedPageContent';
import * as Styled from './SharePanel.styled';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { QRCodeResponse } from 'shared';

type Props = {
  isPageShared: boolean;
};

const SharePanel = ({ isPageShared }: Props) => {
  const [qrCode, setQRCode] = useState<QRCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePopoverOpen = (open: boolean) => {
    if (isPageShared && open && !qrCode) {
      const url = window.location.href;

      setError(null);

      const [request] = api.makeQRCode({ url });
      request.then(setQRCode).catch(setError);
    }
  };

  return (
    <PopoverPrimitive.Root onOpenChange={handlePopoverOpen}>
      <Styled.Trigger>Share</Styled.Trigger>
      <PopoverPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4}>
          {isPageShared ? (
            <SharedPageContent qrCode={qrCode} error={error} />
          ) : (
            <ShareablePageContent />
          )}
        </Styled.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default memo(SharePanel);

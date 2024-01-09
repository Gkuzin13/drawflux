import { memo, useState } from 'react';
import api from '@/services/api';
import ShareablePageContent from './ShareablePageContent';
import SharedPageContent from './SharedPageContent';
import Popover from '@/components/Elements/Popover/Popover';
import Button from '@/components/Elements/Button/Button';
import * as Styled from './SharePanel.styled';
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
    <Popover onOpenChange={handlePopoverOpen}>
      <Popover.Trigger asChild>
        <Button color="primary" size="sm">
          Share
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Styled.PopoverContent align="end" sideOffset={14}>
          {isPageShared ? (
            <SharedPageContent qrCode={qrCode} error={error} />
          ) : (
            <ShareablePageContent />
          )}
        </Styled.PopoverContent>
      </Popover.Portal>
    </Popover>
  );
};

export default memo(SharePanel);

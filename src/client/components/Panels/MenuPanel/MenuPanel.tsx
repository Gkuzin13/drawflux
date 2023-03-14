import { useClickAway } from '@/client/shared/hooks/useClickAway';
import { ICON_SIZES } from '@/client/shared/styles/theme';
import { useRef, useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { TbFileDownload, TbPhotoDown } from 'react-icons/tb';
import Button from '../../Button/Button';
import {
  MenuPanelToggle,
  MenuPanelContent,
  MenuPanelContainer,
} from './MenuPanelStyled';

export type ExportType = 'image/png' | 'drawing';

type Props = {
  onExport: (type: ExportType) => void;
};

const MenuPanel = ({ onExport }: Props) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useClickAway(menuRef, () => setOpen(false));

  const handleOnToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleOnClick = (type: ExportType) => {
    onExport(type);
    setOpen(false);
  };

  return (
    <MenuPanelContainer ref={menuRef}>
      <MenuPanelToggle size="small" squared={true} onClick={handleOnToggle}>
        <IoEllipsisHorizontal size={ICON_SIZES.LARGE} />
      </MenuPanelToggle>
      {open && (
        <MenuPanelContent>
          <Button
            fullWidth={true}
            size="small"
            color="secondary-light"
            onClick={() => handleOnClick('image/png')}
          >
            <TbPhotoDown size={ICON_SIZES.LARGE} />
            Save As Image
          </Button>
          <Button
            fullWidth={true}
            size="small"
            color="secondary-light"
            onClick={() => handleOnClick('drawing')}
          >
            <TbFileDownload size={ICON_SIZES.LARGE} />
            Save Drawing
          </Button>
        </MenuPanelContent>
      )}
    </MenuPanelContainer>
  );
};

export default MenuPanel;

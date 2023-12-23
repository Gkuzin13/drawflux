import { useCallback, useState } from 'react';
import ShapesThumbnail from '@/components/Elements/ShapesThumbnail/ShapesThumbnail';
import { LIBRARY, LIBRARY_ITEM } from '@/constants/panels/library';
import * as Styled from './LibraryItemCard.styled';
import type { LibraryItem } from '@/constants/app';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { ThemeColorValue } from 'shared';

type Props = {
  item: LibraryItem;
  checked: boolean;
  backgroundColor: ThemeColorValue;
  onChecked: (item: LibraryItem) => void;
  onUnchecked: (item: LibraryItem) => void;
  onThumbnailClick: (item: LibraryItem) => void;
};

const LibraryItemCard = ({
  item,
  checked,
  backgroundColor,
  onChecked,
  onUnchecked,
  onThumbnailClick,
}: Props) => {
  const [dragging, setDragging] = useState(false);

  const handleCheckedChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') return;

    if (checked === true) {
      onChecked(item);
    } else {
      onUnchecked(item);
    }
  };

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      setDragging(true);

      if (!event.dataTransfer) return;

      const itemJson = JSON.stringify(item);
      event.dataTransfer.setData(LIBRARY.dataTransferFormat, itemJson);
    },
    [item],
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  const handleOnClick = useCallback(() => {
    onThumbnailClick(item);
  }, [item, onThumbnailClick]);

  return (
    <Styled.Container css={{ backgroundColor }} data-testid="library-item">
      {!dragging && (
        <Styled.Checkbox
          size="sm"
          checked={checked}
          onCheckedChange={handleCheckedChange}
        />
      )}
      <ShapesThumbnail
        nodes={item.elements}
        {...LIBRARY_ITEM.style}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleOnClick}
      />
    </Styled.Container>
  );
};

export default LibraryItemCard;

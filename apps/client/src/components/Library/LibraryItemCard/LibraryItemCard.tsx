import { useCallback, useState } from 'react';
import ShapesThumbnail from '@/components/Elements/ShapesThumbnail/ShapesThumbnail';
import useThemeColors from '@/hooks/useThemeColors';
import { LIBRARY, LIBRARY_ITEM } from '@/constants/panels/library';
import * as Styled from './LibraryItemCard.styled';
import type { LibraryItem } from '@/constants/app';
import type { CheckedState } from '@radix-ui/react-checkbox';

type Props = {
  item: LibraryItem;
  selected: boolean;
  onChecked: (item: LibraryItem) => void;
  onUnchecked: (item: LibraryItem) => void;
};

const LibraryItemCard = ({ item, selected, onChecked, onUnchecked }: Props) => {
  const [dragging, setDragging] = useState(false);

  const themeColors = useThemeColors();

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

      event.dataTransfer?.setData(
        LIBRARY.dataTransferFormat,
        JSON.stringify(item),
      );
    },
    [item],
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <Styled.Container css={{ backgroundColor: themeColors['canvas-bg'].value }}>
      {!dragging && (
        <Styled.Checkbox
          checked={selected}
          onCheckedChange={handleCheckedChange}
        />
      )}
      <ShapesThumbnail
        nodes={item.elements}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        {...LIBRARY_ITEM.style}
        draggable
      />
    </Styled.Container>
  );
};

export default LibraryItemCard;

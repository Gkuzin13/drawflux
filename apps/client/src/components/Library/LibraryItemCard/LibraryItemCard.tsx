import { useCallback, useState } from 'react';
import ShapesThumbnail, {
  type ShapesThumbnailStyle,
} from '@/components/Elements/ShapesThumbnail/ShapesThumbnail';
import * as Styled from './LibraryItemCard.styled';
import type { LibraryItem } from '@/constants/app';
import type { CheckedState } from '@radix-ui/react-checkbox';
import useThemeColors from '@/hooks/useThemeColors';

type Props = {
  item: LibraryItem;
  selected: boolean;
  onChecked: (item: LibraryItem) => void;
  onUnchecked: (item: LibraryItem) => void;
};

const thumbnailStyle: ShapesThumbnailStyle = {
  width: 56,
  height: 56,
  padding: 2,
  shapesScale: 1.5,
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

      const dataTransfer = event.dataTransfer;

      if (!dataTransfer) return;

      dataTransfer.setData('library-item-json', JSON.stringify(item));
    },
    [item],
  );

  const handleDragEnd = useCallback(() => setDragging(false), []);

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
        {...thumbnailStyle}
        draggable
      />
    </Styled.Container>
  );
};

export default LibraryItemCard;

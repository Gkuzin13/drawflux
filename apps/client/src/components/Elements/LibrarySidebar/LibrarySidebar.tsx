import { useState } from 'react';
import LibraryItemCard from '@/components/Library/LibraryItemCard/LibraryItemCard';
import Drawer from '../Drawer/Drawer';
import Icon from '../Icon/Icon';
import Badge from '../Badge/Badge';
import { useAppDispatch } from '@/stores/hooks';
import { libraryActions } from '@/stores/slices/library';
import * as Styled from './LibrarySidebar.styled';
import type { LibraryItem } from '@/constants/app';
import Divider from '../Divider/Divider';

type Props = {
  items: LibraryItem[];
};

type SelectedItemsIds = Record<string, boolean>;

const LibrarySidebar = ({ items }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedItemsIds, setSelectedItemsIds] = useState<SelectedItemsIds>(
    {},
  );

  const selectedItemsCount = Object.keys(selectedItemsIds).length;
  const hasItems = Boolean(items.length);
  const hasSelectedItems = Boolean(selectedItemsCount);

  const dispatch = useAppDispatch();

  const handleRemoveSelectedItems = () => {
    dispatch(libraryActions.removeItems(Object.keys(selectedItemsIds)));
    setSelectedItemsIds({});
  };

  const handleItemSelect = (item: LibraryItem) => {
    setSelectedItemsIds((prevItems) => ({ ...prevItems, [item.id]: true }));
  };

  const handleItemUnselect = (item: LibraryItem) => {
    setSelectedItemsIds((prevItems) => {
      const itemsCopy = { ...prevItems };

      delete itemsCopy[item.id];

      return itemsCopy;
    });
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <Drawer open={open} modal={false}>
      <Styled.Trigger onClick={handleOpen} title="Library">
        <Icon name="book" />
        <span>Library</span>
      </Styled.Trigger>
      <Styled.Content>
        <Drawer.Header>
          <Drawer.Title>Library</Drawer.Title>
          <Drawer.Close onClick={handleClose}>
            <Icon name="x" />
          </Drawer.Close>
        </Drawer.Header>
        <Divider />
        <Styled.ItemsSection>
          <Drawer.Header>
            <Styled.Title>Your items</Styled.Title>
            <Badge content={selectedItemsCount} isInvisible={!hasSelectedItems}>
              <Styled.removeButton
                disabled={!hasSelectedItems}
                onClick={handleRemoveSelectedItems}
              >
                <Icon name="trash" />
              </Styled.removeButton>
            </Badge>
          </Drawer.Header>
          {hasItems ? (
            <Styled.Items>
              {items.map((item) => {
                return (
                  <LibraryItemCard
                    key={item.id}
                    item={item}
                    selected={item.id in selectedItemsIds}
                    onChecked={handleItemSelect}
                    onUnchecked={handleItemUnselect}
                  />
                );
              })}
            </Styled.Items>
          ) : (
            <Styled.Empty>
              <span>Empty here...</span>
            </Styled.Empty>
          )}
        </Styled.ItemsSection>
      </Styled.Content>
    </Drawer>
  );
};

export default LibrarySidebar;

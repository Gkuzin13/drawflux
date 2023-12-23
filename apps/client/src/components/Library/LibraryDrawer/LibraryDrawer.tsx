import { useState } from 'react';
import LibraryItemCard from '@/components/Library/LibraryItemCard/LibraryItemCard';
import Drawer from '@/components/Elements/Drawer/Drawer';
import Icon from '@/components/Elements/Icon/Icon';
import Badge from '@/components/Elements/Badge/Badge';
import Divider from '@/components/Elements/Divider/Divider';
import Text from '@/components/Elements/Text/Text';
import Button from '@/components/Elements/Button/Button';
import useThemeColors from '@/hooks/useThemeColors';
import usePageMutation from '@/hooks/usePageMutation';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import { libraryActions } from '@/stores/slices/library';
import { canvasActions, selectConfig } from '@/stores/slices/canvas';
import { duplicateNodesAtCenter, mapNodesIds } from '@/utils/node';
import * as Styled from './LibraryDrawer.styled';
import type { LibraryItem } from '@/constants/app';

type Props = {
  items: LibraryItem[];
};

type SelectedItemsIds = Record<string, boolean>;

const LibraryDrawer = ({ items }: Props) => {
  const [selectedItemsIds, setSelectedItemsIds] = useState<SelectedItemsIds>(
    {},
  );

  const store = useAppStore();
  const stageConfig = useAppSelector(selectConfig);
  const themeColors = useThemeColors();

  const ws = useWebSocket();

  const selectedItemsCount = Object.keys(selectedItemsIds).length;
  const hasItems = Boolean(items.length);
  const hasSelectedItems = Boolean(selectedItemsCount);

  const dispatch = useAppDispatch();
  const { updatePage } = usePageMutation();

  const handleRemoveSelectedItems = () => {
    dispatch(libraryActions.removeItems(Object.keys(selectedItemsIds)));
    setSelectedItemsIds({});
  };

  const handleItemCheck = (item: LibraryItem) => {
    setSelectedItemsIds((prevItems) => ({ ...prevItems, [item.id]: true }));
  };

  const handleItemUncheck = (item: LibraryItem) => {
    setSelectedItemsIds((prevItems) => {
      const itemsCopy = { ...prevItems };

      delete itemsCopy[item.id];

      return itemsCopy;
    });
  };

  const handleOnThumbnailClick = (item: LibraryItem) => {
    const duplicatedNodes = duplicateNodesAtCenter(item.elements, stageConfig);
    const duplicatedNodesIds = mapNodesIds(duplicatedNodes);

    dispatch(canvasActions.addNodes(duplicatedNodes));
    dispatch(canvasActions.setSelectedNodesIds(duplicatedNodesIds));
    dispatch(canvasActions.setToolType('select'));

    if (ws.isConnected) {
      ws.send({ type: 'nodes-add', data: duplicatedNodes });

      const currentNodes = store.getState().canvas.present.nodes;

      updatePage({ nodes: currentNodes });
    }
  };

  const isItemChecked = (id: LibraryItem['id']) => id in selectedItemsIds;

  const handleOnInteractionOutside = (event: Event) => event.preventDefault();

  return (
    <Drawer modal={false}>
      <Drawer.Trigger align="between" color="secondary" size="sm" gap="sm">
        <Icon name="book" size="lg" />
        <Text size="sm">Library</Text>
      </Drawer.Trigger>
      <Styled.Content onInteractOutside={handleOnInteractionOutside}>
        <Drawer.Header>
          <Drawer.Title>Library</Drawer.Title>
          <Drawer.Close>
            <Icon name="x" />
          </Drawer.Close>
        </Drawer.Header>
        <Divider />
        <Styled.ItemsSection>
          <Styled.ItemsHeader>
            <Text weight="bold">Your items</Text>
            <Badge
              content={selectedItemsCount}
              isInvisible={!hasSelectedItems}
              placement="top-left"
            >
              <Button
                color="danger"
                size="sm"
                disabled={!hasSelectedItems}
                onClick={handleRemoveSelectedItems}
                squared
                data-testid="remove-selected-items-button"
              >
                <Icon name="trash" />
              </Button>
            </Badge>
          </Styled.ItemsHeader>
          {hasItems ? (
            <Styled.Items>
              {items.map((item) => {
                return (
                  <LibraryItemCard
                    key={item.id}
                    item={item}
                    backgroundColor={themeColors['canvas-bg'].value}
                    checked={isItemChecked(item.id)}
                    onChecked={handleItemCheck}
                    onUnchecked={handleItemUncheck}
                    onThumbnailClick={handleOnThumbnailClick}
                  />
                );
              })}
            </Styled.Items>
          ) : (
            <Text color="gray600" align="center" size="sm">
              Empty here...
            </Text>
          )}
        </Styled.ItemsSection>
      </Styled.Content>
    </Drawer>
  );
};

export default LibraryDrawer;

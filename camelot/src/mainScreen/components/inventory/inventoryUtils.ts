import { Item } from '@csegames/library/dist/camelotunchained/graphql/schema';
import Fuse from 'fuse.js/dist/fuse';

export const getInventoryUnpaddedGridItems = (
  inventoryItems: Item[],
  searchValue: string,
  itemsPerRow: number
): Item[][] => {
  const gridItems: Item[][] = [];

  let items = inventoryItems;

  const pattern = searchValue.replace(/ /g, '').toLowerCase();
  if (pattern) {
    const fuse = new Fuse(Object.values(inventoryItems), {
      isCaseSensitive: false,
      shouldSort: true,
      keys: ['staticDefinition.name']
    });
    const results = fuse.search(pattern);
    items = results.map((result) => result.item);
  }

  for (const item of items) {
    if (!gridItems[item.location.inventory.position]) {
      gridItems[item.location.inventory.position] = [];
    }
    gridItems[item.location.inventory.position].push(item);
  }

  while (gridItems.length % itemsPerRow !== 0) {
    gridItems.push([]);
  }

  return Array.from(gridItems, (items) => (items !== undefined ? items : []));
};

export const getInventoryMinEmptyRows = (
  gridElement: HTMLElement,
  inventoryItems: Item[],
  searchValue: string,
  itemsPerRow: number,
  hudWidth: number,
  hudHeight: number
): number => {
  const min = Math.min(hudWidth, hudHeight);
  const minRows = Math.floor(gridElement.offsetHeight / (min / 15));
  const unpaddedRows = getInventoryUnpaddedGridItems(inventoryItems, searchValue, itemsPerRow).length / itemsPerRow;
  return minRows - unpaddedRows;
};

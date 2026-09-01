import Fuse from 'fuse.js/dist/fuse';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';

export const getInventoryUnpaddedGridItems = (
  unfilteredItems: Item[],
  itemsByNumericID: Record<number, ItemDef>,
  searchValue: string
): Item[][] => {
  const gridItems: Item[][] = [];

  let items = unfilteredItems;

  const pattern = searchValue.replace(/ /g, '').toLowerCase();
  if (pattern) {
    const fuse = new Fuse(unfilteredItems, {
      isCaseSensitive: false,
      shouldSort: true,
      // There is no 'staticDefinition' field on Item. We are just using it to indicate that we will look up the name from
      // the static definition in the getter function.
      keys: ['staticDefinition.name'],
      getFn: (obj: Item, path: string | string[]) => {
        if (obj && obj.defID && Array.isArray(path) && path[0] === 'staticDefinition') {
          const staticDefinition = itemsByNumericID[obj.defID];
          if (path.length === 2 && path[1] === 'name' && typeof staticDefinition[path[1]] === 'string') {
            return staticDefinition?.name ?? '';
          } else {
            // We don't currently support any other keys than 'staticDefinition.name'.
            return '';
          }
        } else {
          // Use the default `get` function
          const value = Fuse.config.getFn(obj, path);
          // ... do something with `value`
          return value;
        }
      }
    });
    const results = fuse.search(pattern);
    items = results.map((result) => result.item);
  }

  for (const item of items) {
    if (!gridItems[item.location.position]) {
      gridItems[item.location.position] = [];
    }
    gridItems[item.location.position].push(item);
  }

  return gridItems;
};

export function getItemCount(itemDefID: number, items: Item[]): number {
  return items.reduce<number>((count: number, item: Item) => {
    if (item.defID === itemDefID) {
      return count + item.unitCount;
    }
    return count;
  }, 0);
}

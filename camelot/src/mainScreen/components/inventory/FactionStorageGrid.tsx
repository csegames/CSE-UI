/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { getInventoryUnpaddedGridItems } from '../../helpers/inventoryHelpers';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { ItemIcon } from '../items/ItemIcon';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';

const BASE_CELL_SIZE_VMIN = 6.33;

// CSS classes
const Root = 'HUD-FactionStorageGrid-Root';
const Grid = 'HUD-FactionStorageGrid-Grid';
const GridRow = 'HUD-FactionStorageGrid-GridRow';
const ItemIconWrapper = 'HUD-FactionStorageGrid-ItemIconWrapper';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  type: ItemLocationType;
  maxSlots: number;
  items: Item[];
  searchValue: string;
  cellsPerRow: number;
}

interface InjectedProps {
  itemsByNumericID: Record<number, ItemDef>;
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionStorageGrid extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = { width: -1 };
  }

  render(): React.ReactNode {
    const {
      type,
      maxSlots,
      items,
      searchValue,
      itemsByNumericID,
      uiFactionID,
      stringTable,
      dispatch,
      className,
      ...otherProps
    } = this.props;

    const factionData = getFactionData(uiFactionID);
    const gridItems = this.getGridItems();
    let rows: Item[][][] = [];
    gridItems.forEach((itemSlot: Item[], index: number) => {
      const rowIndex = Math.floor(index / this.props.cellsPerRow);
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(itemSlot);
    });

    return (
      <FactionBorder
        className={`${Root} ${className ?? ''}`}
        type={BorderType.Primary}
        background={BorderBackground.Bag}
        {...otherProps}
      >
        <div className={Grid}>
          {rows.map((itemSlots: Item[][], rowIndex: number) => {
            return (
              <div className={GridRow}>
                {itemSlots.map((items, itemIndex) => (
                  <FactionBorder className={ItemIconWrapper} type={BorderType.Secondary}>
                    <ItemIcon
                      type={type}
                      slotImageURL={factionData.squareBackgroundImage}
                      items={items}
                      size={`${BASE_CELL_SIZE_VMIN}vmin`}
                      slotIndex={itemIndex + rowIndex * this.props.cellsPerRow}
                      key={itemIndex + rowIndex * this.props.cellsPerRow}
                    />
                  </FactionBorder>
                ))}
              </div>
            );
          })}
        </div>
      </FactionBorder>
    );
  }

  private getGridItems(): Item[][] {
    // This gets data based on existing inventory.
    let gridItems: Item[][] = getInventoryUnpaddedGridItems(
      this.props.items,
      this.props.itemsByNumericID,
      this.props.searchValue
    );

    // This fills out the bag up to capacity (with empty slots, of course).
    for (let i: number = 0; i < this.props.maxSlots; i++) {
      if (!gridItems[i]) {
        gridItems[i] = [];
      }
    }

    return gridItems;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable
  };
};

export const FactionStorageGrid = connect(mapStateToProps)(AFactionStorageGrid);

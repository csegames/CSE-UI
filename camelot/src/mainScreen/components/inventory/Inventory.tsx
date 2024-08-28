/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, addMenuWidgetExiting } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { RootState } from '../../redux/store';
import { BarHeader } from '../BarHeader';
import { Item } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { SearchInput } from '../input/SearchInput';
import { ItemIcon } from '../items/ItemIcon';
import { CloseButton } from '../../../shared/components/CloseButton';
import { refreshItems } from '../items/itemUtils';
import { InitTopic } from '../../redux/initializationSlice';
import { InventoryFooter } from './InventoryFooter';
import { getInventoryMinEmptyRows, getInventoryUnpaddedGridItems } from './inventoryUtils';
import {
  updateInventoryEmptyRows,
  updateInventoryItemsPerRow,
  updateInventorySearchValue
} from '../../redux/inventorySlice';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import ItemSlotURL from '../../../images/inventory/item-slot.png';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

const Root = 'HUD-Inventory-Root';
const Container = 'HUD-Inventory-Container';
const Header = 'HUD-Inventory-Header';
const HeaderOverlay = 'HUD-Inventory-HeaderOverlay';
const Filter = 'HUD-Inventory-Filter';
const GridWrapper = 'HUD-Inventory-GridWrapper';
const Grid = 'HUD-Inventory-Grid';
const Scroller = 'Scroller-ThumbOnly';
const TopRightCloseButton = 'HUD-TopRightCloseButton';

interface ReactProps {}

interface InjectedProps {
  inventoryItems: Item[];
  hudWidth: number;
  hudHeight: number;
  itemsPerRow: number | null;
  emptyRows: number;
  searchValue: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInventory extends React.Component<Props> {
  gridElement?: HTMLDivElement;

  render(): JSX.Element {
    const gridItems = this.getGridItems();
    return (
      <div className={Root}>
        <div className={Container}>
          <Escapable escapeID={WIDGET_NAME_INVENTORY} onEscape={this.closeSelf.bind(this)} />
          <CloseButton className={TopRightCloseButton} onClick={this.closeSelf.bind(this)} />
          <BarHeader className={Header} overlayClassName={HeaderOverlay}>
            Inventory
          </BarHeader>
          <div className={Filter}>
            <SearchInput value={this.props.searchValue} setValue={this.setSearchValue.bind(this)} />
          </div>
          <div
            className={`${GridWrapper} ${Scroller}`}
            ref={(gridElement) => {
              if (gridElement) {
                const lastGridElement = this.gridElement;
                this.gridElement = gridElement;
                if (!lastGridElement) {
                  this.updateItemsPerRow();
                }
              }
            }}
          >
            <div className={Grid}>
              {gridItems.map((items, itemIndex) => (
                <ItemIcon
                  items={items}
                  size={`${100 / this.props.itemsPerRow - 1}%`}
                  inventoryIndex={itemIndex}
                  slotImageURL={ItemSlotURL}
                  key={itemIndex}
                />
              ))}
            </div>
          </div>
          <InventoryFooter gridElement={this.gridElement} />
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    refreshItems();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.hudWidth !== this.props.hudWidth || prevProps.hudHeight !== this.props.hudHeight) {
      this.updateItemsPerRow();
    }
  }

  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_INVENTORY));
  }

  setSearchValue(searchValue: string): void {
    this.props.dispatch(updateInventorySearchValue(searchValue));
  }

  getGridItems(): Item[][] {
    let gridItems: Item[][] = [];

    if (this.props.itemsPerRow) {
      gridItems = getInventoryUnpaddedGridItems(
        this.props.inventoryItems,
        this.props.searchValue,
        this.props.itemsPerRow
      );
      for (let i: number = 0; i < this.props.itemsPerRow * this.props.emptyRows; i++) {
        gridItems.push([]);
      }
    }

    return gridItems;
  }

  updateItemsPerRow(): void {
    if (this.gridElement) {
      const min = Math.min(this.props.hudWidth, this.props.hudHeight);
      const itemsPerRow = Math.floor(this.gridElement.offsetWidth / (min / 15));
      const minEmptyRows = this.gridElement
        ? getInventoryMinEmptyRows(
            this.gridElement,
            this.props.inventoryItems,
            this.props.searchValue,
            itemsPerRow,
            this.props.hudWidth,
            this.props.hudHeight
          )
        : 0;
      this.props.dispatch(updateInventoryItemsPerRow(itemsPerRow));
      this.props.dispatch(updateInventoryEmptyRows(minEmptyRows));
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    inventoryItems: state.inventory.items ?? [],
    hudWidth: state.hud.hudWidth,
    hudHeight: state.hud.hudHeight,
    itemsPerRow: state.inventory.itemsPerRow,
    emptyRows: state.inventory.emptyRows,
    searchValue: state.inventory.searchValue
  };
};

const Inventory = connect(mapStateToProps)(AInventory);

export const WIDGET_NAME_INVENTORY = 'Inventory';
export const inventoryRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_INVENTORY,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 3,
    yOffset: 4.5
  },
  initTopics: [InitTopic.GameDefs, InitTopic.EquippedItems, InitTopic.Inventory, InitTopic.MyCharacterStats],
  layer: HUDLayer.Menus,
  render: () => {
    return <Inventory />;
  }
};

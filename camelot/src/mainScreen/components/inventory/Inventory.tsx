/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { InventorySearchBar } from './InventorySearchBar';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionStorageGrid } from './FactionStorageGrid';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import { CurrencyID, getCurrency } from '../../helpers/itemHelpers';
import { FactionScrollArea } from '../FactionScrollArea';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import BackpackIconURL from '../../../images/icons/inventory/icon-storage-backpack.png';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';

// CSS classes
const Root = 'HUD-Inventory-Root';
const RootContent = 'HUD-Inventory-RootContent';
const BagSlotsSection = 'HUD-Inventory-BagSlotsSection';
const BagSlotRoot = 'HUD-Inventory-BagSlotRoot';
const BackpackIcon = 'HUD-Inventory-BackpackIcon';
const Search = 'HUD-Inventory-Search';
const Gold = 'HUD-Inventory-Gold';
const ScrollArea = 'HUD-Inventory-ScrollArea';
const ScrollAreaContent = 'HUD-Inventory-ScrollAreaContent';
const StorageRow = 'HUD-Inventory-StorageRow';
const StorageIconContainer = 'HUD-Inventory-StorageIconContainer';
const StorageGrid = 'HUD-Inventory-StorageGrid';
const Handle = 'HUD-FancyBorder-HeaderHandle';

requestAddImagesToCache(Root, [BackpackIconURL]);

// String IDs
const StringIDInventoryTitle = 'InventoryTitle';

interface State {
  searchValue: string;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  inventoryCapacityBase: number;
  inventoryItems: Item[];
  wallet: Item[];
  itemsByNumericID: Record<number, ItemDef>;
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInventory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { searchValue: '' };
  }

  render(): JSX.Element {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.FancyHeader}
        background={BorderBackground.Leather}
        titleText={getStringTableValue(StringIDInventoryTitle, this.props.stringTable)}
        cornerButtons={[
          <FactionCornerButton
            type={CornerButtonType.Close}
            onClick={() => {
              this.closeSelf();
            }}
          />
        ]}
      >
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_INVENTORY} onEscape={this.closeSelf.bind(this)} />}
        <div className={RootContent}>
          {this.renderBagSlotsSection()}
          <InventorySearchBar
            className={Search}
            value={this.state.searchValue}
            onValueChanged={(newValue) => this.setState({ searchValue: newValue })}
          />
          <MoneyDisplay
            className={Gold}
            sizeOverrideVmin={3}
            amount={getCurrency(CurrencyID.Gold, this.props.wallet, this.props.itemsByNumericID)?.unitCount ?? 0}
          />
          {this.renderStorageSection()}
        </div>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_INVENTORY} />
      </FactionBorder>
    );
  }

  private renderBagSlotsSection(): React.ReactNode {
    return (
      <div className={BagSlotsSection}>
        <FactionBorder className={BagSlotRoot} type={BorderType.Decorative} background={BorderBackground.PatternSmall}>
          <img className={BackpackIcon} src={BackpackIconURL} />
        </FactionBorder>
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        ></FactionBorder>
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        />
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        />
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        />
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        />
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
        />
      </div>
    );
  }

  private renderStorageSection(): React.ReactNode {
    return (
      <FactionScrollArea className={ScrollArea}>
        <div className={ScrollAreaContent}>
          <div className={StorageRow}>
            <FactionBorder
              className={StorageIconContainer}
              type={BorderType.Decorative}
              background={BorderBackground.PatternSmall}
            >
              <img className={BackpackIcon} src={BackpackIconURL} />
            </FactionBorder>
            <FactionStorageGrid
              type={ItemLocationType.Inventory}
              className={StorageGrid}
              maxSlots={this.props.inventoryCapacityBase}
              cellsPerRow={8}
              items={this.props.inventoryItems}
              searchValue={this.state.searchValue}
            />
          </div>
        </div>
      </FactionScrollArea>
    );
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_INVENTORY));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { wallet, primary: inventoryItems } = state.inventory;
  return {
    ...ownProps,
    inventoryCapacityBase: state.gameDefs.settings.inventoryCapacityBase,
    inventoryItems,
    wallet,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    stringTable: state.stringTable.stringTable
  };
};

const Inventory = connect(mapStateToProps)(AInventory);

export const WIDGET_ID_INVENTORY = 'Inventory';
export const inventoryRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_INVENTORY,
  nameStringID: 'HUDEditorWidgetNameInventory',
  nativeWidgetID: 'inventory',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 5,
    yOffset: 7
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Inventory isDragCopy={isDragCopy} />;
  }
};

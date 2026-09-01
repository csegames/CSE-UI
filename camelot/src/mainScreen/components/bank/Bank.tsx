/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { getStringTableValue, StringIDGeneralCancel, StringIDGeneralConfirm } from '../../helpers/stringTableHelpers';
import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { hideModal, ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import TooltipSource from '../TooltipSource';
import { InventorySearchBar } from '../inventory/InventorySearchBar';
import { FactionScrollArea } from '../FactionScrollArea';
import { FactionStorageGrid } from '../inventory/FactionStorageGrid';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import VaultIconURL from '../../../images/icons/inventory/icon-storage-vault.png';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

// CSS classes
const Root = 'HUD-Bank-Root';
const RootContent = 'HUD-Bank-RootContent';
const BagSlotsSection = 'HUD-Bank-BagSlotsSection';
const BagSlotRoot = 'HUD-Bank-BagSlotRoot';
const VaultIcon = 'HUD-Bank-VaultIcon';
const BagSlotBuyLabel = 'HUD-Bank-BagSlotBuyLabel';
const BankExpansionCost = 'HUD-Bank-BankExpansionCost';
const BagSlotTooltipSource = 'HUD-Bank-BagSlotTooltipSource';
const SearchBar = 'HUD-Bank-SearchBar';
const ScrollArea = 'HUD-Bank-ScrollArea';
const ScrollAreaContent = 'HUD-Bank-ScrollAreaContent';
const StorageRow = 'HUD-Bank-StorageRow';
const StorageIconContainer = 'HUD-Bank-StorageIconContainer';
const StorageGrid = 'HUD-Bank-StorageGrid';
const Handle = 'HUD-FancyBorder-HeaderHandle';

requestAddImagesToCache(Root, [VaultIconURL]);

// String IDs
const StringIDBankTitle = 'BankTitle';
const StringIDBankExpansionTitle = 'BankExpansionTitle';
const StringIDBankExpansionPrompt = 'BankExpansionPrompt';
const StringIDBankExpansionTooltip = 'BankExpansionTooltip';

interface State {
  searchValue: string;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  itemsByNumericID: Record<number, ItemDef>;
  accountBank: Item[];
  accountBankCapacityBase: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ABank extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchValue: ''
    };
  }

  render(): React.ReactNode {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.FancyHeader}
        background={BorderBackground.Leather}
        titleText={getStringTableValue(StringIDBankTitle, this.props.stringTable)}
        cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
      >
        {!this.props.isDragCopy && (
          <Escapable
            escapeID={WIDGET_ID_BANK}
            onEscape={this.closeSelf.bind(this)}
            sound={SoundEvents.PLAY_UI_ABILITY_WINDOW_OPEN}
          />
        )}
        <div className={RootContent}>
          {this.renderBagSlotsSection()}
          <InventorySearchBar
            className={SearchBar}
            value={this.state.searchValue}
            onValueChanged={(newValue: string) => this.setState({ searchValue: newValue })}
          />
          {this.renderStorageSection()}
        </div>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_BANK} />
      </FactionBorder>
    );
  }

  componentDidMount(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_VENDOR_WINDOW_OPEN);
  }

  componentWillUnmount(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_VENDOR_WINDOW_CLOSE);
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
              <img className={VaultIcon} src={VaultIconURL} />
            </FactionBorder>
            <FactionStorageGrid
              type={ItemLocationType.AccountBank}
              className={StorageGrid}
              maxSlots={this.props.accountBankCapacityBase}
              cellsPerRow={8}
              items={this.props.accountBank}
              searchValue={this.state.searchValue}
            />
          </div>
        </div>
      </FactionScrollArea>
    );
  }

  private renderBagSlotsSection(): React.ReactNode {
    return (
      <div className={BagSlotsSection}>
        <FactionBorder className={BagSlotRoot} type={BorderType.Decorative} background={BorderBackground.PatternSmall}>
          <img className={VaultIcon} src={VaultIconURL} />
        </FactionBorder>
        <FactionBorder
          className={`${BagSlotRoot} disabled`}
          type={BorderType.Decorative}
          background={BorderBackground.PatternSmall}
          onClick={this.onBuyBagSlotClicked.bind(this)}
        >
          <div className={BagSlotBuyLabel}>{'+'}</div>
          <TooltipSource
            className={BagSlotTooltipSource}
            tooltipID='ExpandBankTooltip'
            content={() => getStringTableValue(StringIDBankExpansionTooltip, this.props.stringTable)}
            positionType='mouse'
          />
        </FactionBorder>
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

  private onBuyBagSlotClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_METAL_VAULT_DOOR);

    // TODO: Use real info once we build the back end for bank bags!
    const cost = 150;
    // TODO: Check if the user can afford the slot.
    const canAfford = false;

    const model: ModalModel = {
      title: getStringTableValue(StringIDBankExpansionTitle, this.props.stringTable),
      message: getStringTableValue(StringIDBankExpansionPrompt, this.props.stringTable),
      body: <MoneyDisplay className={BankExpansionCost} sizeOverrideVmin={4} amount={cost} />,
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
          onClick: () => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CANCEL_RETURN);
            this.props.dispatch(hideModal());
          }
        },
        {
          text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
          onClick: () => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          },
          isDisabled: !canAfford
        }
      ]
    };

    const params: ModalParams = {
      id: `BuyBagSlot`,
      content: model,
      maxWidth: '35vmin'
    };

    this.props.dispatch(showModal(params));
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_BANK));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    accountBank: state.inventory.accountBank,
    accountBankCapacityBase: state.gameDefs.settings.accountBankCapacityBase
  };
};

const Bank = connect(mapStateToProps)(ABank);

export const WIDGET_ID_BANK = 'Bank';
export const bankRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_BANK,
  nameStringID: 'HUDEditorWidgetNameBank',
  nativeWidgetID: 'account_bank',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 5,
    yOffset: 7
  },
  initTopics: [],
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Bank isDragCopy={isDragCopy} />;
  }
};

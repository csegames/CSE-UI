/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import { CurrencyID, getCurrency } from '../../helpers/itemHelpers';
import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { getFactionData } from '../../gameData/factionData';
import { FactionMoneyInput } from '../FactionMoneyInput';
import { FactionButton } from '../FactionButton';
import TooltipSource from '../TooltipSource';
import { TradeSnapshot, TradeState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/TradeSnapshot';
import { ItemCompareTooltip } from '../items/ItemCompareTooltip';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ItemIcon } from '../items/ItemIcon';
import { forceSyncTradeItemBookkeeping } from '../../dataSources/tradeService';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { clearTradeItemPositions } from '../../redux/tradeSlice';

/** How long to wait for a requested gold update to go through before retrying. */
const GOLD_VALIDATION_INTERVAL_MS = 1000;
/** If we are out of sync for this long, we will forcibly resync local item data to match the server. */
const ITEM_SYNC_TIMEOUT_MS = 5000;

// CSS classes
const Root = 'HUD-Trade-Root';
const RootContent = 'HUD-Trade-RootContent';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const TradeColumn = 'HUD-Trade-TradeColumn';
const Splitter = 'HUD-Trade-Splitter';
const NameSection = 'HUD-Trade-NameSection';
const NameRow = 'HUD-Trade-NameRow';
const PlayerName = 'HUD-Trade-PlayerName';
const YourMoney = 'HUD-Trade-YourMoney';
const LegendRow = 'HUD-Trade-LegendRow';
const LegendLabel = 'HUD-Trade-LegendLabel';
const TradeRowSpacer = 'HUD-Trade-TradeRowSpacer';
const RowSection = 'HUD-Trade-RowSection';
const RowBackground = 'HUD-Trade-RowBackground';
const MoneyInput = 'HUD-Trade-MoneyInput';
const MoneySection = 'HUD-Trade-MoneySection';
const MoneyRow = 'HUD-Trade-MoneyRow';
const MoneyBig = 'HUD-Trade-MoneyBig';
const MoneySmall = 'HUD-Trade-MoneySmall';
const MoneyLabelBig = 'HUD-Trade-MoneyLabelBig';
const MoneyLabelSmall = 'HUD-Trade-MoneyLabelSmall';
const TaperBar = 'HUD-Trade-TaperBar';
const TradeButton = 'HUD-Trade-TradeButton';
const TooltipWrapper = 'HUD-Trade-TooltipWrapper';
const TooltipTitle = 'HUD-Trade-TooltipTitle';
const TooltipDescription = 'HUD-Trade-TooltipDescription';
const ErrorLabel = 'HUD-Trade-ErrorLabel';
const ItemIconContainer = 'HUD-Trade-ItemIconContainer';
const TradeItemIcon = 'HUD-Trade-ItemIcon';
const ItemCount = 'HUD-Trade-ItemCount';
const ItemOverlay = 'HUD-Trade-ItemOverlay';
const ItemName = 'HUD-Trade-ItemName';
const ItemTax = 'HUD-Trade-ItemTax';
const ConfirmationGlow = 'HUD-Trade-ConfirmationGlow';

// String IDs
const StringIDTradeTitle = 'TradeTitle';
const StringIDTradeItem = 'TradeItem';
const StringIDTradePropertyTax = 'TradePropertyTax';
const StringIDTradePropertyTaxDescription = 'TradePropertyTaxDescription';
const StringIDTradeGoldReceived = 'TradeGoldReceived';
const StringIDTradeGoldReceivedDescription = 'TradeGoldReceivedDescription';
const StringIDTradeTaxesDue = 'TradeTaxesDue';
const StringIDTradeTaxesDueDescription = 'TradeTaxesDueDescription';
const StringIDTradeNetGold = 'TradeNetGold';
const StringIDTradeNetGoldDescription = 'TradeNetGoldDescription';
const StringIDTradeInsufficientGold = 'TradeInsufficientGold';
const StringIDTradeGoldOutOfSync = 'TradeGoldOutOfSync';
const StringIDTradeItemsOutOfSync = 'TradeItemsOutOfSync';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  wallet: Item[];
  itemsByNumericID: Record<number, ItemDef>;
  selfName: string;
  uiFactionID: string;
  tradeCapacity: number;
  tradeSnapshot: TradeSnapshot;
  tradeItemPositions: Record<number, string>;
  defs: GameDefsState;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class ATrade extends React.Component<Props> {
  private expectedGoldTradeAmount: number = 0;
  private goldValidationTimeout: number = 0;
  private itemValidationTimeout: number = 0;

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <FactionBorder
        className={Root}
        type={BorderType.FancyHeader}
        background={BorderBackground.Leather}
        titleText={getStringTableValue(StringIDTradeTitle, this.props.stringTable)}
        cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
      >
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_TRADE} onEscape={this.closeSelf.bind(this)} />}
        <div className={RootContent}>
          {this.renderYourColumn()}
          <div
            className={Splitter}
            style={{
              backgroundImage: `url(${factionData.edgeDecorativeLeftImage})`
            }}
          ></div>
          {this.renderTheirColumn()}
        </div>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_TRADE} />
      </FactionBorder>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (
      this.props.tradeSnapshot.tradeItems !== prevProps.tradeSnapshot.tradeItems ||
      this.props.tradeItemPositions !== prevProps.tradeItemPositions
    ) {
      if (this.getAreItemsInSync()) {
        // If items are in sync, clear the force sync timeout.
        this.clearItemValidationTimeout();
      } else if (!this.itemValidationTimeout) {
        // If items are not in sync, and we don't have a force sync queued up, start it.
        // This will happen normally every time a TradeItemMove request is sent out.  If nothing goes wrong,
        // tradeService will receive an updated trade state soon after and update redux, at which point
        // items should be in sync and this will get canceled.
        this.itemValidationTimeout = window.setTimeout(this.forceSyncItems.bind(this), ITEM_SYNC_TIMEOUT_MS);
      }
    }
  }

  private getAreItemsInSync(): boolean {
    const areItemsInSync =
      // Same number of items in local bookkeeping and server bookkeeping.
      Object.values(this.props.tradeItemPositions).length === this.props.tradeSnapshot.tradeItems.length &&
      // Every item in local bookkeeping matches up to an item in server bookkeeping.
      Object.values(this.props.tradeItemPositions).every((itemInstanceID) =>
        this.props.tradeSnapshot.tradeItems.find((tradeItem) => tradeItem.instanceID === itemInstanceID)
      );
    return areItemsInSync;
  }

  private forceSyncItems(): void {
    // One last chance to see if the data mismatch has resolved itself...
    if (!this.getAreItemsInSync()) {
      // If we arrive here, then we know we have sent change requests out, but something went wrong.
      // We've waited a few seconds to let the server resolve itself (in case it was just lag), but at this
      // point we can't take the risk anymore, so it's time to force update local bookkeeping to match
      // the server, since server should always be the source of truth.

      forceSyncTradeItemBookkeeping(
        this.props.tradeItemPositions,
        this.props.tradeSnapshot.tradeItems,
        this.props.tradeCapacity,
        this.props.dispatch
      );
    }

    // In any case, we should now be in sync.
    this.clearItemValidationTimeout();
  }

  private renderYourColumn(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const theirMoneyAmount = this.getTheirTradeMoneyAmount();
    const goldReceivedAmount = theirMoneyAmount;

    // You pay a tax on items received.
    const itemsReceivedTax = this.props.tradeSnapshot.tradeTargetItems.reduce<number>(
      (taxSoFar: number, tradeItem: Item) => {
        const def = this.props.defs.itemsByNumericID[tradeItem.defID];
        return (
          taxSoFar +
          Math.trunc((def.defStats.BaseValue ?? 1) * this.props.defs.settings.tradeItemsReceivedTaxFrac) *
            tradeItem.unitCount
        );
      },
      0
    );

    // You "pay" a tax on money received.  Effectively, you just receive less than the amount the other guy is trying to send.
    const goldTransferTax = Math.trunc(goldReceivedAmount * this.props.defs.settings.tradeGoldTaxFrac);

    const taxesDueAmount = itemsReceivedTax + goldTransferTax;

    const yourTotalMoneyAmount = this.getYourTotalMoneyAmount();
    const yourTradeMoneyAmount = this.getYourTradeMoneyAmount();
    const netGoldAmount = theirMoneyAmount - this.expectedGoldTradeAmount - taxesDueAmount;
    const canAfford = yourTotalMoneyAmount + netGoldAmount >= 0 && this.expectedGoldTradeAmount <= yourTotalMoneyAmount;
    const isTradingGold = netGoldAmount !== 0;
    const isGoldInSync = yourTradeMoneyAmount === this.expectedGoldTradeAmount;
    const isTradingItems =
      this.props.tradeSnapshot.tradeItems.length > 0 || this.props.tradeSnapshot.tradeTargetItems.length > 0;
    const isConfirmed = this.props.tradeSnapshot.tradeState === TradeState.Confirmed;
    const areItemsInSync = this.getAreItemsInSync();
    const canTrade = !isConfirmed && canAfford && (isTradingGold || isTradingItems) && isGoldInSync && areItemsInSync;

    return (
      <div className={TradeColumn}>
        <div className={NameSection} style={{ borderBottomColor: factionData.borderColor }}>
          <div className={NameRow}>
            <div className={PlayerName}>{`${this.props.selfName}\xa0(`}</div>
            <MoneyDisplay className={YourMoney} amount={this.getYourTotalMoneyAmount()} />
            <div className={PlayerName}>{')'}</div>
          </div>
        </div>
        <div className={LegendRow}>
          <div className={LegendLabel}>{getStringTableValue(StringIDTradeItem, this.props.stringTable)}</div>
          <TooltipSource
            tooltipID='PropertyTax'
            maxWidth='28vmin'
            content={this.renderInfoTooltip.bind(this, StringIDTradePropertyTax, StringIDTradePropertyTaxDescription)}
            positionType='mouse'
          >
            <div className={LegendLabel}>{getStringTableValue(StringIDTradePropertyTax, this.props.stringTable)}</div>
          </TooltipSource>
        </div>
        {this.renderYourTradeRows()}
        <FactionMoneyInput
          className={MoneyInput}
          amount={0}
          continuousUpdate={true}
          onAmountChanged={(newAmount: number) => {
            // By tracking the expectation, we can try to repair the data on a backend error.
            this.expectedGoldTradeAmount = newAmount;
            this.requestGoldUpdate();
          }}
        />
        <div className={MoneySection}>
          <TooltipSource
            className={MoneyRow}
            tooltipID='GoldReceived'
            maxWidth='28vmin'
            content={this.renderInfoTooltip.bind(this, StringIDTradeGoldReceived, StringIDTradeGoldReceivedDescription)}
            positionType='mouse'
          >
            <div className={MoneyLabelSmall}>
              {getStringTableValue(StringIDTradeGoldReceived, this.props.stringTable)}
            </div>
            <MoneyDisplay className={MoneySmall} amount={goldReceivedAmount} />
          </TooltipSource>
          <TooltipSource
            className={MoneyRow}
            tooltipID='TaxesDue'
            maxWidth='28vmin'
            content={this.renderInfoTooltip.bind(this, StringIDTradeTaxesDue, StringIDTradeTaxesDueDescription)}
            positionType='mouse'
          >
            <div className={MoneyLabelSmall}>{getStringTableValue(StringIDTradeTaxesDue, this.props.stringTable)}</div>
            <MoneyDisplay className={MoneySmall} amount={taxesDueAmount} />
          </TooltipSource>
          <div
            className={TaperBar}
            style={{
              background: `linear-gradient(to right, transparent 0%, ${factionData.borderColor} 36%, ${factionData.borderColor} 71%, transparent 100%)`
            }}
          />
          <TooltipSource
            className={MoneyRow}
            tooltipID='NetGold'
            maxWidth='28vmin'
            content={this.renderInfoTooltip.bind(this, StringIDTradeNetGold, StringIDTradeNetGoldDescription)}
            positionType='mouse'
          >
            <div className={MoneyLabelBig}>{getStringTableValue(StringIDTradeNetGold, this.props.stringTable)}</div>
            <MoneyDisplay className={MoneyBig} isDelta={true} amount={netGoldAmount} sizeOverrideVmin={2.35} />
          </TooltipSource>
          <div className={ErrorLabel}>{this.getErrorMessage(canAfford, isGoldInSync, areItemsInSync)}</div>
          <FactionButton className={TradeButton} disabled={!canTrade} onClick={this.onTradeClick.bind(this)}>
            {getStringTableValue(StringIDTradeTitle, this.props.stringTable)}
          </FactionButton>
        </div>
        {isConfirmed && (
          <div
            className={ConfirmationGlow}
            style={{ boxShadow: `inset 0 0 2vmin 1vmin ${factionData.selectionGlowColor}` }}
          />
        )}
      </div>
    );
  }

  private getErrorMessage(canAfford: boolean, isGoldInSync: boolean, areItemsInSync: boolean): string {
    if (!canAfford) {
      return getStringTableValue(StringIDTradeInsufficientGold, this.props.stringTable);
    }
    if (!isGoldInSync) {
      return getStringTableValue(StringIDTradeGoldOutOfSync, this.props.stringTable);
    }
    if (!areItemsInSync) {
      return getStringTableValue(StringIDTradeItemsOutOfSync, this.props.stringTable);
    }

    return '';
  }

  componentWillUnmount(): void {
    this.clearGoldValidationTimeout();
    this.clearItemValidationTimeout();
    this.props.dispatch?.(clearTradeItemPositions());
  }

  private clearGoldValidationTimeout(): void {
    if (this.goldValidationTimeout) {
      window.clearTimeout(this.goldValidationTimeout);
      this.goldValidationTimeout = 0;
    }
  }

  private clearItemValidationTimeout(): void {
    if (this.itemValidationTimeout) {
      window.clearTimeout(this.itemValidationTimeout);
      this.itemValidationTimeout = 0;
    }
  }

  private requestGoldUpdate(): void {
    // If we were waiting on a previous change, we cancel it in favor of any new change.
    this.clearGoldValidationTimeout();

    // Start by checking if the data matches our expectations.
    const yourTotalMoneyAmount = this.getYourTotalMoneyAmount();
    const yourTradeMoneyAmount = this.getYourTradeMoneyAmount();
    // Right now, the backend caps TradeMoneyAmount at your total wallet contents, but we want to let the user input ANY number.
    // We use this "moneyTarget" to separate the user's expectations from the server's expectations.
    const moneyTarget = Math.min(yourTotalMoneyAmount, this.expectedGoldTradeAmount);
    const deltaMoney = moneyTarget - yourTradeMoneyAmount;
    if (deltaMoney === 0) {
      return;
    }

    const goldItem = getCurrency(CurrencyID.Gold, this.props.wallet, this.props.itemsByNumericID);
    if (goldItem) {
      // "moveTradeItem" does add/subtract, not set, so we use the delta.
      clientAPI.moveTradeItem(goldItem.instanceID, deltaMoney);
      // Now that we've sent the request, start up the validation interval to confirm that it goes through.
      this.goldValidationTimeout = window.setTimeout(this.requestGoldUpdate.bind(this), GOLD_VALIDATION_INTERVAL_MS);
    }
  }

  private onTradeClick(): void {
    clientAPI.confirmTradeItems(this.props.tradeSnapshot.revision);
  }

  private renderInfoTooltip(titleKey: string, descriptionKey: string) {
    return (
      <div className={TooltipWrapper}>
        <div className={TooltipTitle}>{getStringTableValue(titleKey, this.props.stringTable)}</div>
        <div className={TooltipDescription}>{getStringTableValue(descriptionKey, this.props.stringTable)}</div>
      </div>
    );
  }

  private getTheirTradeMoneyAmount(): number {
    const moneyAmount =
      this.props.tradeSnapshot.tradeTargetCurrency.find((item) => {
        const def = this.props.itemsByNumericID[item.defID];
        return def?.id === CurrencyID.Gold;
      })?.unitCount ?? 0;
    return moneyAmount;
  }

  private getYourTradeMoneyAmount(): number {
    const moneyAmount =
      this.props.tradeSnapshot.tradeCurrency.find((item) => {
        const def = this.props.itemsByNumericID[item.defID];
        return def?.id === CurrencyID.Gold;
      })?.unitCount ?? 0;
    return moneyAmount;
  }

  private getYourTotalMoneyAmount(): number {
    // This is messy because adding currency to a trade removes it from your wallet.
    // To get the correct value, we have to combine what's in your wallet and what's in the trade.
    const yourTradeMoneyAmount = this.getYourTradeMoneyAmount();
    const yourWalletMoneyAmount =
      getCurrency(CurrencyID.Gold, this.props.wallet, this.props.itemsByNumericID)?.unitCount ?? 0;

    return yourTradeMoneyAmount + yourWalletMoneyAmount;
  }

  private renderTheirColumn(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const isConfirmed = this.props.tradeSnapshot.tradeTargetState === TradeState.Confirmed;

    return (
      <div className={TradeColumn}>
        <div className={NameSection} style={{ borderBottomColor: factionData.borderColor }}>
          <div className={NameRow}>
            <div className={PlayerName}>{this.props.tradeSnapshot.tradeTargetName}</div>
          </div>
        </div>
        <div className={LegendRow}>
          <div className={LegendLabel}>{getStringTableValue(StringIDTradeItem, this.props.stringTable)}</div>
          <div className={LegendLabel}>{getStringTableValue(StringIDTradePropertyTax, this.props.stringTable)}</div>
        </div>
        {this.renderTheirTradeRows()}
        <FactionMoneyInput
          className={MoneyInput}
          amount={this.getTheirTradeMoneyAmount()}
          onAmountChanged={(newAmount: number) => {}}
          disabled={true}
          forceUpdate={true}
        />
        {isConfirmed && (
          <div
            className={ConfirmationGlow}
            style={{ boxShadow: `inset 0 0 2vmin 1vmin ${factionData.selectionGlowColor}` }}
          />
        )}
      </div>
    );
  }

  private renderYourTradeRows(): React.ReactNode {
    const numRows = this.props.tradeCapacity;

    const rows: React.ReactNode[] = [];

    for (let i = 0; i < numRows; ++i) {
      const itemInstanceID = this.props.tradeItemPositions[i];
      const item = itemInstanceID
        ? this.props.tradeSnapshot.tradeItems.find((item) => item.instanceID === itemInstanceID)
        : undefined;
      rows.push(this.renderYourTradeRow(i, item));
      if (i !== numRows - 1) {
        rows.push(<div className={TradeRowSpacer} />);
      }
    }

    return <>{rows}</>;
  }

  private renderTheirTradeRows(): React.ReactNode {
    const numRows = this.props.tradeCapacity;

    const rows: React.ReactNode[] = [];
    for (let i = 0; i < numRows; ++i) {
      rows.push(this.renderTheirTradeRow(i, this.props.tradeSnapshot?.tradeTargetItems[i]));
      if (i !== numRows - 1) {
        rows.push(<div className={TradeRowSpacer} />);
      }
    }

    return <>{rows}</>;
  }

  private renderYourTradeRow(index: number, data?: Item): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const itemDef = this.props.itemsByNumericID[data?.defID];

    return (
      <div
        className={RowSection}
        key={`TradeRow${index}`}
        style={{
          borderTop: `1px solid ${factionData.borderColor}`,
          borderBottom: `1px solid ${factionData.borderColor}`
        }}
      >
        <img className={RowBackground} src={factionData.mailRowBackgroundImage} />

        <FactionBorder
          className={ItemIconContainer}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
        >
          <ItemIcon type={ItemLocationType._Trade} slotIndex={index} items={data ? [data] : []} size={'5.2vmin'} />
        </FactionBorder>

        <div className={ItemName}>{itemDef?.name ?? ''}</div>
        {/** You only pay tax on items received.  Your rows are for items you are giving, thus no tax display. */}
      </div>
    );
  }

  private renderTheirTradeRow(index: number, data?: Item): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const itemDef = this.props.itemsByNumericID[data?.defID];
    const iconURL = itemDef?.iconUrl;
    const unitCount = data?.unitCount ?? 0;
    const baseValue = itemDef?.defStats?.BaseValue ?? 0;

    // Property tax is only for items received.  All items in Their rows are ones you will be receiving, and thus are taxed.
    const propertyTaxAmount = Math.trunc(baseValue * unitCount * this.props.defs.settings.tradeItemsReceivedTaxFrac);

    return (
      <div
        className={RowSection}
        key={`TradeRow${index}`}
        style={{
          borderTop: `1px solid ${factionData.borderColor}`,
          borderBottom: `1px solid ${factionData.borderColor}`
        }}
      >
        <img className={RowBackground} src={factionData.mailRowBackgroundImage} />

        <FactionBorder
          className={ItemIconContainer}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
        >
          {data && (
            <TooltipSource
              tooltipID={`Inventory-Item-${data?.instanceID}`}
              content={() => <ItemCompareTooltip items={[data]} />}
              positionType='mouse'
              noOuterBorder
            >
              {iconURL && <img className={TradeItemIcon} src={iconURL} />}
              {itemDef?.isStackableItem && <span className={ItemCount}>{unitCount}</span>}
              <div className={ItemOverlay} />
            </TooltipSource>
          )}
        </FactionBorder>

        <div className={ItemName}>{itemDef?.name ?? ''}</div>
        {data && <MoneyDisplay className={ItemTax} amount={propertyTaxAmount} />}
      </div>
    );
  }

  private closeSelf(): void {
    clientAPI.cancelTrade();
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_TRADE));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    wallet: state.inventory.wallet,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    selfName: state.entities.self.name,
    uiFactionID: state.hud.uiFactionID,
    tradeCapacity: state.gameDefs.settings.tradeCapacity,
    tradeSnapshot: state.trade.tradeSnapshot,
    tradeItemPositions: state.trade.tradeItemPositions,
    defs: state.gameDefs
  };
};

const Trade = connect(mapStateToProps)(ATrade);

export const WIDGET_ID_TRADE = 'Trade';
export const tradeRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_TRADE,
  nameStringID: 'HUDEditorWidgetNameTrade',
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
    return <Trade isDragCopy={isDragCopy} />;
  }
};

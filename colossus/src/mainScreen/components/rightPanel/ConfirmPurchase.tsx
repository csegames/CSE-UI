/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import {
  PerkDefGQL,
  PerkRewardDefGQL,
  PurchaseDefGQL,
  PerkType,
  PurchaseRewardDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import { setPurchaseIdToProcess, updateConfirmPurchaseSelectedRewardIndex } from '../../redux/storeSlice';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  BUX_PERK_ID,
  OwnershipStatus,
  PurchaseOwnershipData,
  getFinalPurchaseCost,
  getPurchaseOwnershipData,
  isFreeReward
} from '../../helpers/storeHelpers';
import { Overlay, hideRightPanel, showOverlay } from '../../redux/navigationSlice';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { PerkIcon } from '../views/Lobby/Store/PerkIcon';

const Container = 'StartScreen-Store-ConfirmPurchase-Container';
const ContentCenterer = 'StartScreen-Store-ConfirmPurchase-ContentCenterer';
const Title = 'StartScreen-Store-ConfirmPurchase-Title';
const NameAndPriceContainer = 'StartScreen-Store-ConfirmPurchase-NameAndPriceContainer';
const PriceContainer = 'StartScreen-Store-ConfirmPurchase-PriceContainer';
const DiscountContainer = 'StartScreen-Store-ConfirmPurchase-DiscountContainer';
const Name = 'StartScreen-Store-ConfirmPurchase-Name';
const DiscountName = 'StartScreen-Store-ConfirmPurchase-DiscountName';
const DescriptionListContainer = 'StartScreen-Store-ConfirmPurchase-DescriptionListContainer';
const DescriptionListEntry = 'StartScreen-Store-ConfirmPurchase-DescriptionListEntry';
const RewardsContainer = 'StartScreen-Store-ConfirmPurchase-RewardsContainer';
const PackageIconContainer = 'StartScreen-Store-ConfirmPurchase-PackageIconContainer';
const PackageIcon = 'StartScreen-Store-ConfirmPurchase-PackageIcon';
const PackageRewardCount = 'StartScreen-Store-ConfirmPurchase-PackageRewardCount';
const PackageOwnedOverlay = 'StartScreen-Store-ConfirmPurchase-PackageOwnedOverlay';
const CostAmount = 'StartScreen-Store-ConfirmPurchase-CostAmount';
const CostIcon = 'StartScreen-Store-ConfirmPurchase-CostIcon';
const BuxNeededLabel = 'StartScreen-Store-ConfirmPurchase-BuxNeededLabel';
const ButtonsContainer = 'StartScreen-Store-ConfirmPurchase-ButtonsContainer';
const ButtonStyle = 'StartScreen-Store-ConfirmPurchase-Button';
const ConsoleIcon = 'StartScreen-Store-ConfirmPurchase-ConsoleIcon';
const DividerLine = 'StartScreen-Store-ConfirmPurchase-DividerLine';
const InsufficientFundsContainer = 'StartScreen-Store-ConfirmPurchase-InsufficientFundsContainer';
const FinalBalanceContainer = 'StartScreen-Store-ConfirmPurchase-FinalBalanceContainer';
const FinalBalanceTitle = 'StartScreen-Store-ConfirmPurchase-FinalBalanceTitle';
const FinalBalanceCurrencyIcon = 'StartScreen-Store-ConfirmPurchase-FinalBalanceCurrencyIcon';
const FinalBalanceCurrencyText = 'StartScreen-Store-ConfirmPurchase-FinalBalanceCurrencyText';
const ConfirmPurchaseContainer = 'StartScreen-Store-ConfirmPurchase-ConfirmPurchaseContainer';
const ConfirmPurchaseButton = 'StartScreen-Store-ConfirmPurchase-ConfirmPurchaseButton';
const ConfirmPurchaseButtonFill = 'StartScreen-Store-ConfirmPurchase-ConfirmPurchaseButtonFill';
const ConfirmPurchaseText = 'StartScreen-Store-ConfirmPurchase-ConfirmPurchaseText';
const CloseButtonCorner = 'Shared-CloseButton-Corner';

const StringIDConfirmPurchaseNeedMore = 'ConfirmPurchaseNeedMore';
const StringIDConfirmPurchaseUnknownName = 'ConfirmPurchaseUnknownName';
const StringIDConfirmPurchaseBuyButton = 'ConfirmPurchaseBuyButton';
const StringIDConfirmPurchaseBuyBundleButton = 'ConfirmPurchaseBuyBundleButton';
const StringIDConfirmPurchaseRedeemButton = 'ConfirmPurchaseRedeemButton';
const StringIDConfirmPurchaseBuyMore = 'ConfirmPurchaseBuyMore';
const StringIDConfirmPurchaseTitle = 'ConfirmPurchaseTitle';
const StringIDConfirmBattlePassPurchaseCurrentTiers = 'ConfirmBattlePassPurchaseCurrentTiers';
const StringIDConfirmBattlePassPurchaseDescription2 = 'ConfirmBattlePassPurchaseDescription2';
const StringIDConfirmBattlePassPurchaseDescription3 = 'ConfirmBattlePassPurchaseDescription3';
const StringIDConfirmPurchaseFinalBalance = 'ConfirmPurchaseFinalBalance';
const StringIDConfirmPurchaseCheckboxText = 'ConfirmPurchaseCheckboxText';
const StringIDStoreFree = 'StoreFree';
const StringIDStoreOwned = 'StoreOwned';

interface ReactProps {
  purchase: PurchaseDefGQL;
  currentQuestTier?: number;
  suppressAlertStar?: boolean;
  confirmPurchaseForHighCost?: boolean;
}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  ownedPerks: Dictionary<number>;
  rmtCurrencyIds: Dictionary<boolean>;
  dispatch?: Dispatch;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  expensivePurchaseGemThreshold: number;
  confirmPurchaseSelectedRewardIndex: number;
}

type Props = ReactProps & InjectedProps;

interface State {
  isPurchasing: boolean;
  isConfirmed: boolean;
  highlightConfirmation: boolean;
}

class AConfirmPurchase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isPurchasing: false,
      isConfirmed: false,
      highlightConfirmation: false
    };
  }

  render() {
    const rewards = this.props.purchase.perks.filter((reward) => {
      const perk = this.props.perksByID[reward.perkID];
      return perk.perkType !== PerkType.Key;
    });

    return (
      <div className={Container}>
        <div className={ContentCenterer}>
          <div
            className={`${CloseButtonCorner} fs-icon-misc-fail`}
            onClick={() => {
              this.props.dispatch?.(hideRightPanel());
            }}
          />
          <div className={Title}>{getStringTableValue(StringIDConfirmPurchaseTitle, this.props.stringTable)}</div>
          <div className={DividerLine} />
          <div className={NameAndPriceContainer}>
            <div className={Name}>{this.getPackageTitle()}</div>
            {this.renderPrice()}
          </div>
          {this.renderDiscounts()}
          <div className={RewardsContainer}>{rewards.map(this.renderRewardCell.bind(this))}</div>
          {this.getPackageDescription()}
          <div className={DividerLine} />
          {this.getConfirmPurchase()}
          {this.getPurchaseButtons()}
          {this.getFinalBalance()}
          {this.renderShortageLabels()}
        </div>
      </div>
    );
  }

  private renderRewardCell(reward: PurchaseRewardDefGQL, index: number): React.ReactNode {
    const perk = this.props.perksByID[reward.perkID];
    const selectedClass = index === this.props.confirmPurchaseSelectedRewardIndex ? 'selected' : '';
    const isOwned = perk.isUnique && this.props.ownedPerks[reward.perkID] > 0;

    return (
      <div
        className={`${PackageIconContainer} ${perk.perkType} ${selectedClass}`}
        key={index}
        onClick={this.onRewardClick.bind(this, index)}
      >
        <img className={PackageIcon} src={this.getPerkImageURL(perk)} />
        {reward.qty > 1 && <div className={PackageRewardCount}>{`x${reward.qty}`}</div>}
        {isOwned && (
          <div className={PackageOwnedOverlay}>{getStringTableValue(StringIDStoreOwned, this.props.stringTable)}</div>
        )}
      </div>
    );
  }

  componentDidMount(): void {
    // Whenever ConfirmPurchase is shown, start with the first reward selected.
    if (this.props.confirmPurchaseSelectedRewardIndex !== 0) {
      this.props.dispatch?.(updateConfirmPurchaseSelectedRewardIndex(0));
    }
  }

  private onRewardClick(rewardIndex: number): void {
    this.props.dispatch?.(updateConfirmPurchaseSelectedRewardIndex(rewardIndex));
  }

  private renderPrice(): React.ReactNode {
    // A free item will just say "Free".
    if (isFreeReward(this.props.purchase)) {
      return (
        <div className={`${CostAmount} free`}>{getStringTableValue(StringIDStoreFree, this.props.stringTable)}</div>
      );
    }

    // A discounted bundle will show the original price with no icon, strikethrough font.
    const ownershipData = getPurchaseOwnershipData(this.props.purchase, this.props.perksByID, this.props.ownedPerks);
    if (ownershipData.hasBundleDiscount) {
      return (
        <span className={`${CostAmount} discount strikethrough`}>{`${addCommasToNumber(
          this.props.purchase.costs[0].qty
        )}`}</span>
      );
    }

    // A full-price item will show the full price.
    // Note that this currently supports only purchases that cost a single perk type.
    return (
      <div className={PriceContainer}>
        <PerkIcon className={CostIcon} perkID={this.props.purchase.costs[0].perkID} />
        <span className={CostAmount}>{`${addCommasToNumber(this.props.purchase.costs[0].qty)}`}</span>
      </div>
    );
  }

  private renderDiscounts(): React.ReactNode {
    const ownershipData = getPurchaseOwnershipData(this.props.purchase, this.props.perksByID, this.props.ownedPerks);
    if (ownershipData.status === OwnershipStatus.PartiallyOwned && ownershipData.hasBundleDiscount) {
      const discountedRewards = this.props.purchase.perks.filter((reward) => {
        return reward.bundleDiscountPerkQty > 0 && ownershipData.ownedUniquePerkIDs.includes(reward.perkID);
      });

      // Note that this only works for single cost purchases.
      const cost = this.props.purchase.costs[0];
      const finalPrice = getFinalPurchaseCost(this.props.purchase, this.props.perksByID, this.props.ownedPerks).find(
        (c) => c.perkID === cost.perkID
      ).qty;

      return (
        <>
          {discountedRewards.map((reward, index) => {
            const rewardPerk = this.props.perksByID[reward.perkID];
            return (
              <div className={DiscountContainer} key={`discount${index}`}>
                <div className={DiscountName}>{`${this.getPerkDiscountName(rewardPerk)} - ${getStringTableValue(
                  StringIDStoreOwned,
                  this.props.stringTable
                )}`}</div>
                <div className={`${CostAmount} discount`}>{`-${addCommasToNumber(reward.bundleDiscountPerkQty)}`}</div>
              </div>
            );
          })}
          <div className={DiscountContainer}>
            <div className={DiscountName} />
            <div className={PriceContainer}>
              <PerkIcon className={CostIcon} perkID={this.props.purchase.costs[0].perkID} />
              <span className={CostAmount}>{`${addCommasToNumber(finalPrice)}`}</span>
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  private getPerkDiscountName(perk: PerkDefGQL): string {
    if (perk && perk.isUnique && perk.champion) {
      return `${perk.name} ${perk.champion.name}`;
    } else {
      return perk.name;
    }
  }

  private renderRewardLine(reward: PerkRewardDefGQL, ownershipData: PurchaseOwnershipData): JSX.Element {
    const perk = this.props.perksByID[reward.perkID];
    let text: string = this.getPerkDiscountName(perk);

    if (!perk.isUnique) {
      text = `${reward.qty}x ${text}`;
    }

    const isOwned = ownershipData.ownedUniquePerkIDs.includes(perk.id);

    return (
      <li className={DescriptionListEntry}>
        <span className={`${DescriptionListEntry} ${isOwned ? 'owned' : ''}`}>{text}</span>
        {isOwned && (
          <span className={DescriptionListEntry}>{`\xa0-\xa0${getStringTableValue(
            StringIDStoreOwned,
            this.props.stringTable
          )}`}</span>
        )}
      </li>
    );
  }

  private getConfirmPurchase(): JSX.Element {
    if (this.getShortages().length == 0 && this.props.confirmPurchaseForHighCost && this.isHighCost()) {
      return (
        <div className={ConfirmPurchaseContainer}>
          <button
            className={`${ConfirmPurchaseButton} ${this.state.highlightConfirmation ? 'Highlighted' : ''}`}
            onClick={this.onConfirmPressed.bind(this)}
          >
            {this.state.isConfirmed && <div className={ConfirmPurchaseButtonFill} />}
          </button>
          <div className={ConfirmPurchaseText}>
            {getStringTableValue(StringIDConfirmPurchaseCheckboxText, this.props.stringTable)}
          </div>
        </div>
      );
    }

    return null;
  }

  private isHighCost(): boolean {
    return (
      this.props.expensivePurchaseGemThreshold > 0 &&
      this.props.purchase.costs.find(
        (c) => c.perkID == BUX_PERK_ID && c.qty >= this.props.expensivePurchaseGemThreshold
      ) != null
    );
  }

  private renderShortageLabels(): JSX.Element[] {
    const labels: JSX.Element[] = [];

    // Check for shortages.
    const finalCosts = getFinalPurchaseCost(this.props.purchase, this.props.perksByID, this.props.ownedPerks);
    finalCosts.forEach((cost) => {
      const numOwned = this.props.ownedPerks[cost.perkID] ?? 0;

      if (numOwned < cost.qty) {
        labels.push(
          <div className={InsufficientFundsContainer}>
            <div className={BuxNeededLabel}>
              {getStringTableValue(StringIDConfirmPurchaseNeedMore, this.props.stringTable)}
            </div>
            <div className={PriceContainer}>
              <PerkIcon className={CostIcon} perkID={cost.perkID} />
              <span className={BuxNeededLabel}>-{addCommasToNumber(cost.qty - numOwned)}</span>
            </div>
          </div>
        );
      }
    });

    return labels;
  }

  private getPackageTitle(): string {
    // If the PurchaseDef has a title, use that.
    if (this.props.purchase.name && this.props.purchase.name.length > 0) {
      return this.props.purchase.name;
    }

    // If the PerkDef has a title, use that.
    if (this.props.purchase.perks && this.props.purchase.perks.length > 0) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];

      if (perk && perk.name && perk.name.length > 0) {
        return perk.name;
      }
    }

    // If all else fails, just calculate a title manually.
    return getStringTableValue(StringIDConfirmPurchaseUnknownName, this.props.stringTable);
  }

  private getPackageDescription(): JSX.Element {
    if (!this.props.purchase.perks) {
      return null;
    }

    const ownershipData = getPurchaseOwnershipData(this.props.purchase, this.props.perksByID, this.props.ownedPerks);

    const descriptions: JSX.Element[] = [];

    if (this.props.purchase.perks.length === 1) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];

      // If we're selling a key, use a special description
      if (perk) {
        if (perk.perkType == PerkType.Key) {
          if (this.props.currentQuestTier > 0) {
            descriptions.push(
              <li className={DescriptionListEntry}>
                {getTokenizedStringTableValue(StringIDConfirmBattlePassPurchaseCurrentTiers, this.props.stringTable, {
                  CURRENT_TIER: this.props.currentQuestTier.toString()
                })}
              </li>
            );

            descriptions.push(
              <li className={DescriptionListEntry}>
                {getStringTableValue(StringIDConfirmBattlePassPurchaseDescription3, this.props.stringTable)}
              </li>
            );
          } else {
            descriptions.push(
              <li className={DescriptionListEntry}>
                {getStringTableValue(StringIDConfirmBattlePassPurchaseDescription2, this.props.stringTable)}
              </li>
            );
          }
        } else {
          descriptions.push(this.renderRewardLine(this.props.purchase.perks[0], ownershipData));

          const defDescription =
            this.props.purchase.description && this.props.purchase.description.length > 0
              ? this.props.purchase.description
              : perk.description && perk.description.length > 0
              ? perk.description
              : null;

          if (defDescription) {
            descriptions.push(<li className={DescriptionListEntry}>{defDescription}</li>);
          }
        }
      }
    } else {
      this.props.purchase.perks.forEach((p) => descriptions.push(this.renderRewardLine(p, ownershipData)));
    }

    if (descriptions.length > 0) {
      return <ul className={DescriptionListContainer}>{descriptions}</ul>;
    }

    // Perk descriptions are optional
    return null;
  }

  private getPerkImageURL(perk: PerkDefGQL): string {
    if (
      this.props.purchase.iconURL &&
      this.props.purchase.iconURL.length > 0 &&
      this.props.purchase.perks.length == 1
    ) {
      return this.props.purchase.iconURL;
    }

    if (perk && perk.iconURL && perk.iconURL.length > 0) {
      return perk.iconURL;
    }

    // If all else fails, at least we can show SOMETHING.
    return 'images/fullscreen/gamestats/card-default.jpg';
  }

  private getPurchaseButtons(): JSX.Element {
    let tooPoor = this.getShortages().length > 0;
    const rmtShortage = tooPoor ? this.getRMTShortage() : null;

    let buttonText: string | JSX.Element = getStringTableValue(
      this.props.purchase.perks.length > 1 && !rmtShortage
        ? StringIDConfirmPurchaseBuyBundleButton
        : StringIDConfirmPurchaseBuyButton,
      this.props.stringTable
    );

    if (isFreeReward(this.props.purchase)) {
      buttonText = getStringTableValue(StringIDConfirmPurchaseRedeemButton, this.props.stringTable);
    } else if (this.props.usingGamepad && this.props.usingGamepadInMainMenu) {
      buttonText = (
        <>
          <span className={`${ConsoleIcon} icon-xb-a`} />
          {buttonText}
        </>
      );
    }

    return (
      <div className={ButtonsContainer}>
        <Button
          text={buttonText}
          type='primary'
          onClick={this.onPurchaseClick.bind(this)}
          styles={ButtonStyle}
          disabled={tooPoor || this.state.isPurchasing}
        />
        {this.getShortageButton(rmtShortage)}
      </div>
    );
  }

  private getShortageButton(rmtShortage: PerkDefGQL): JSX.Element {
    if (rmtShortage) {
      const buttonText = (
        <>
          {getTokenizedStringTableValue(StringIDConfirmPurchaseBuyMore, this.props.stringTable, {
            NAME: rmtShortage.name
          })}
          <PerkIcon className={CostIcon} perkID={rmtShortage.id} colorOverride={'white'} />
        </>
      );

      return <Button text={buttonText} type='primary' onClick={this.onGoToRMTClick.bind(this)} styles={ButtonStyle} />;
    }

    return null;
  }

  private getFinalBalance(): JSX.Element {
    if (isFreeReward(this.props.purchase)) {
      return null;
    }

    let tooPoor = this.getShortages().length > 0;
    if (tooPoor) {
      return null;
    }

    const finalBalances: JSX.Element[] = this.props.purchase.costs.map((cost) => {
      const perk = this.props.perksByID[cost.perkID];
      const currentQty = this.props.ownedPerks[cost.perkID] ?? 0;

      return (
        <div>
          <span
            className={`${FinalBalanceCurrencyIcon} ${perk.iconClass} Current`}
            style={{ color: `#${perk.iconClassColor}` }}
          />
          <span className={`${FinalBalanceCurrencyText} Current`}>{`${addCommasToNumber(currentQty)}`}</span>
          <span className={`${FinalBalanceCurrencyText} Arrow fs-icon-misc-right-arrow`} />
          <span
            className={`${FinalBalanceCurrencyIcon} ${perk.iconClass}`}
            style={{ color: `#${perk.iconClassColor}` }}
          />
          <span className={FinalBalanceCurrencyText}>{`${addCommasToNumber(currentQty - cost.qty)}`}</span>
        </div>
      );
    });

    return (
      <div className={FinalBalanceContainer}>
        <div className={FinalBalanceTitle}>
          {getStringTableValue(StringIDConfirmPurchaseFinalBalance, this.props.stringTable)}
        </div>
        <div>{finalBalances}</div>
      </div>
    );
  }

  private getShortages(): PerkDefGQL[] {
    const shortages: PerkDefGQL[] = [];
    this.props.purchase.costs.forEach((cost) => {
      // If it costs zero, there's no shortage.
      if (cost.qty === 0) {
        return;
      }
      const numOwned = this.props.ownedPerks[cost.perkID] ?? 0;
      if (numOwned < cost.qty) {
        shortages.push(this.props.perksByID[cost.perkID]);
      }
    });
    return shortages;
  }

  private getRMTShortage(): PerkDefGQL {
    // Any shortage that can be fixed with real money is an opportunity. ;)
    return this.getShortages().find((perk) => {
      return this.props.rmtCurrencyIds[perk.id] != null;
    });
  }

  private async onGoToRMTClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);
    // Overlays appear UNDER the right panel, so we have to dismiss it first.
    this.props.dispatch?.(hideRightPanel());
    // Summon RMT purchase overlay.
    this.props.dispatch?.(showOverlay(Overlay.PurchaseGems));
  }

  private async onConfirmPressed() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);
    this.setState({ highlightConfirmation: false, isConfirmed: !this.state.isConfirmed });
  }

  private async onPurchaseClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);

    // if we're showing the high cost confirm widget, the player must have checked it
    // if they haven't checked it, highlight it so it catches their attention
    if (this.props.confirmPurchaseForHighCost && this.isHighCost() && !this.state.isConfirmed) {
      this.setState({ highlightConfirmation: true });
      return;
    }

    // Transition over to the PurchaseProcessingModal.
    this.props.dispatch?.(setPurchaseIdToProcess([this.props.purchase.id, this.props.suppressAlertStar]));
    this.props.dispatch?.(showOverlay(Overlay.PurchaseProcessing));

    this.setState({ isPurchasing: false });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { rmtCurrencyIds, perksByID, confirmPurchaseSelectedRewardIndex } = state.store;
  const { ownedPerks } = state.profile;
  const { stringTable } = state.stringTable;
  const { expensivePurchaseGemThreshold } = state.gameSettings;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    ownedPerks,
    rmtCurrencyIds,
    perksByID,
    stringTable,
    expensivePurchaseGemThreshold,
    confirmPurchaseSelectedRewardIndex
  };
}

export const ConfirmPurchase = connect(mapStateToProps)(AConfirmPurchase);

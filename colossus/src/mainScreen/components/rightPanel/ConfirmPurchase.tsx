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
  PerkGQL,
  PerkDefGQL,
  PerkRewardDefGQL,
  PurchaseDefGQL,
  ChampionGQL,
  ChampionCostumeInfo,
  ClassDefRef,
  PerkType
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import { StoreRoute, setPurchaseIdToProcess, updateStoreCurrentRoute } from '../../redux/storeSlice';
import { getThumbnailURLForChampion } from '../../helpers/characterHelpers';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { BUX_PERK_ID, isFreeReward } from '../../helpers/storeHelpers';
import { LobbyView, Overlay, hideRightPanel, navigateTo, showOverlay } from '../../redux/navigationSlice';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'StartScreen-Store-ConfirmPurchase-Container';
const ContentCenterer = 'StartScreen-Store-ConfirmPurchase-ContentCenterer';
const Title = 'StartScreen-Store-ConfirmPurchase-Title';
const NameAndPriceContainer = 'StartScreen-Store-ConfirmPurchase-NameAndPriceContainer';
const Name = 'StartScreen-Store-ConfirmPurchase-Name';
const DescriptionListContainer = 'StartScreen-Store-ConfirmPurchase-DescriptionListContainer';
const DescriptionListEntry = 'StartScreen-Store-ConfirmPurchase-DescriptionListEntry';
const RewardsContainer = 'StartScreen-Store-ConfirmPurchase-RewardsContainer';
const PackageIconContainer = 'StartScreen-Store-ConfirmPurchase-PackageIconContainer';
const RewardLineChampionPortrait = 'StartScreen-Store-ConfirmPurchase-RewardLineChampionPortrait';
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

const StringIDConfirmPurchaseNeedMore = 'ConfirmPurchaseNeedMore';
const StringIDConfirmPurchaseUnknownName = 'ConfirmPurchaseUnknownName';
const StringIDConfirmPurchaseBuyButton = 'ConfirmPurchaseBuyButton';
const StringIDConfirmPurchaseRedeemButton = 'ConfirmPurchaseRedeemButton';
const StringIDConfirmPurchaseBuyMore = 'ConfirmPurchaseBuyMore';
const StringIDConfirmPurchaseMultipleForChamp = 'ConfirmPurchaseMultipleForChamp';
const StringIDConfirmPurchaseSingleForChamp = 'ConfirmPurchaseSingleForChamp';
const StringIDConfirmPurchaseMultiple = 'ConfirmPurchaseMultiple';
const StringIDConfirmPurchaseConfirm = 'ConfirmPurchaseConfirm';
const StringIDConfirmBattlePassPurchaseCurrentTiers = 'ConfirmBattlePassPurchaseCurrentTiers';
const StringIDConfirmBattlePassPurchaseDescription2 = 'ConfirmBattlePassPurchaseDescription2';
const StringIDConfirmBattlePassPurchaseDescription3 = 'ConfirmBattlePassPurchaseDescription3';
const StringIDConfirmPurchaseFinalBalance = 'ConfirmPurchaseFinalBalance';
const StringIDConfirmPurchaseCheckboxText = 'ConfirmPurchaseCheckboxText';

interface ReactProps {
  purchase: PurchaseDefGQL;
  currentQuestTier?: number;
  suppressAlertStar?: boolean;
  confirmPurchaseForHighCost?: boolean;
}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  ownedPerks: PerkGQL[];
  rmtCurrencyIds: Dictionary<boolean>;
  dispatch?: Dispatch;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  expensivePurchaseGemThreshold: number;
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
    const rewards = this.props.purchase.perks;

    let imageSizeClass: string = '';
    if (rewards.length >= 5) {
      imageSizeClass = 'Small';
    }

    return (
      <div className={Container}>
        <div className={ContentCenterer}>
          <div className={Title}>{getStringTableValue(StringIDConfirmPurchaseConfirm, this.props.stringTable)}</div>
          <div className={NameAndPriceContainer}>
            <div className={Name}>{this.getPackageTitle()}</div>
            {this.renderPrice()}
          </div>
          <div className={RewardsContainer}>
            {rewards.map((reward) => {
              const perk = this.props.perksByID[reward.perkID];
              if (perk.perkType == PerkType.Key) {
                return null;
              }

              return (
                <div
                  className={`${PackageIconContainer} ${imageSizeClass} ${perk.perkType}`}
                  style={{ backgroundImage: `url(${this.getPerkImageURL(perk)})` }}
                />
              );
            })}
          </div>
          {this.getPackageDescription()}
          <div className={DividerLine} />
          {this.renderShortageLabels()}
          {this.getConfirmPurchase()}
          {this.getPurchaseButtons()}
          {this.getFinalBalance()}
        </div>
      </div>
    );
  }

  private renderPrice(): JSX.Element[] {
    if (isFreeReward(this.props.purchase)) {
      return null;
    }

    const priceTags: JSX.Element[] = this.props.purchase.costs.map((cost) => {
      const perk = this.props.perksByID[cost.perkID];
      return (
        <div>
          <span className={`${CostIcon} ${perk.iconClass}`} style={{ color: `#${perk.iconClassColor}` }} />
          <span className={CostAmount}>{`${addCommasToNumber(cost.qty)}`}</span>
        </div>
      );
    });

    return priceTags;
  }

  private renderRewardLine(reward: PerkRewardDefGQL): JSX.Element {
    const perk = this.props.perksByID[reward.perkID];
    const isSpecificChampion = perk.champion && perk.champion.id;
    let text: string = '';
    const tokens = {
      AMOUNT: reward.qty.toString(),
      NAME: perk.name
    };

    if (reward.qty > 1 && isSpecificChampion) {
      text = getTokenizedStringTableValue(StringIDConfirmPurchaseMultipleForChamp, this.props.stringTable, tokens);
    } else if (reward.qty <= 1 && isSpecificChampion) {
      text = getTokenizedStringTableValue(StringIDConfirmPurchaseSingleForChamp, this.props.stringTable, tokens);
    } else if (reward.qty > 1 && !isSpecificChampion) {
      text = getTokenizedStringTableValue(StringIDConfirmPurchaseMultiple, this.props.stringTable, tokens);
    } else {
      text = `${perk.name}`;
    }

    return (
      <li className={DescriptionListEntry}>
        <span className={DescriptionListEntry}>{text}</span>
        {isSpecificChampion && this.getChampionPortrait(perk.champion)}
      </li>
    );
  }

  private getChampionPortrait(champion: ClassDefRef): JSX.Element {
    if (!champion) {
      return null;
    }

    const portraitURL = getThumbnailURLForChampion(
      this.props.championCostumes,
      this.props.champions,
      this.props.perksByID,
      champion
    );

    return <img className={RewardLineChampionPortrait} src={portraitURL} />;
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
    this.props.purchase.costs.forEach((cost) => {
      const ownedPerk = this.props.ownedPerks.find((p) => p.id == cost.perkID);
      const numOwned = ownedPerk ? ownedPerk.qty : 0;

      if (numOwned < cost.qty) {
        const perk = this.props.perksByID[cost.perkID];

        labels.push(
          <div className={InsufficientFundsContainer}>
            <div className={BuxNeededLabel}>
              {getStringTableValue(StringIDConfirmPurchaseNeedMore, this.props.stringTable)}
            </div>
            <div>
              <span className={`${CostIcon} ${perk.iconClass}`} style={{ color: `#${perk.iconClassColor}` }} />
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
          descriptions.push(this.renderRewardLine(this.props.purchase.perks[0]));

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
      this.props.purchase.perks.forEach((p) => descriptions.push(this.renderRewardLine(p)));
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
    let buttonText: string | JSX.Element = getStringTableValue(
      StringIDConfirmPurchaseBuyButton,
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

    const rmtShortage = tooPoor ? this.getRMTShortage() : null;
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
          <span className={`${ConsoleIcon} ${rmtShortage.iconClass}`} />
        </>
      );

      return <Button text={buttonText} type='primary' onClick={this.onGoToRMTClick.bind(this)} styles={ButtonStyle} />;
    }

    return null;
  }

  private getFinalBalance(): JSX.Element {
    let tooPoor = this.getShortages().length > 0;
    if (tooPoor) {
      return null;
    }

    const finalBalances: JSX.Element[] = this.props.purchase.costs.map((cost) => {
      const perk = this.props.perksByID[cost.perkID];
      const currentQty =
        this.props.ownedPerks.find((op) => {
          return op.id === cost.perkID;
        })?.qty ?? 0;

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
      const matchingPerk = this.props.ownedPerks.find((op) => {
        return op.id === cost.perkID;
      });
      if (!matchingPerk || matchingPerk.qty < cost.qty) {
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
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
    // Send user to RMT tab in the store.
    this.props.dispatch(hideRightPanel());
    setTimeout(() => {
      this.props.dispatch(updateStoreCurrentRoute(StoreRoute.Currency));
      this.props.dispatch(navigateTo(LobbyView.Store));
    }, 200);
  }

  private async onConfirmPressed() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
    this.setState({ highlightConfirmation: false, isConfirmed: !this.state.isConfirmed });
  }

  private async onPurchaseClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);

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
  const ownedPerks = state.profile?.perks ?? [];
  const { rmtCurrencyIds, perksByID } = state.store;
  const { championCostumes } = state.championInfo;
  const { champions } = state.profile;
  const { stringTable } = state.stringTable;
  const { expensivePurchaseGemThreshold } = state.gameSettings;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    ownedPerks,
    rmtCurrencyIds,
    championCostumes,
    champions,
    perksByID,
    stringTable,
    expensivePurchaseGemThreshold
  };
}

export const ConfirmPurchase = connect(mapStateToProps)(AConfirmPurchase);

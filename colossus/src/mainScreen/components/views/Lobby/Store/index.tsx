/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StoreNavMenu } from './StoreNavMenu';
import { ConfirmPurchase } from '../../../rightPanel/ConfirmPurchase';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { StoreRoute, updateStoreNewPurchases } from '../../../../redux/storeSlice';
import { Button } from '../../../shared/Button';
import {
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  QuestGQL,
  RMTPurchaseDefGQL,
  StoreTab,
  StoreTabConfig,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { StoreItemCell } from './StoreItemCell';
import {
  OwnershipStatus,
  PurchaseOwnershipData,
  areLocksFulfilled,
  getPurchaseOwnershipData,
  isFreeReward,
  isPurchaseable
} from '../../../../helpers/storeHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from 'redux';
import { showRightPanel } from '../../../../redux/navigationSlice';
import {
  StringIDGeneralBack,
  StringIDGeneralSelect,
  getStringTableValue
} from '../../../../helpers/stringTableHelpers';
import { StoreFeaturingLayout, StoreFeaturingLayoutItemCount, StoreFeaturingPage } from './StoreFeaturingPage';
import { StoreFilters } from './StoreFilters';
import { ConfirmPurchaseRewardPreviews } from '../../../rightPanel/ConfirmPurchaseRewardPreviews';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'StartScreen-Store-Container';
const ItemsContainer = 'StartScreen-Store-ItemsContainer';
const FilterAndItemsContainer = 'StartScreen-Store-FilterAndItemsContainer';
const ItemsAnimationContainer = 'StartScreen-Store-ItemsAnimationContainer';
const ButtonPosition = 'StartScreen-Store-ButtonPosition';
const ConsoleIcon = 'StartScreen-Store-ConsoleIcon';
const EmptyPageMessage = 'StartScreen-Store-EmptyPageMessage';
const ItemSmall = 'StartScreen-Store-ItemSmall';
const ConsoleSelectSpacing = 'StartScreen-Store-ConsoleSelectSpacing';

const StringIDStoreEmptyTab1 = 'StoreEmptyTab1';
const StringIDStoreEmptyTab2 = 'StoreEmptyTab2';

interface State {
  sortedPurchases: PurchaseDefGQL[];
}

interface ReactProps {}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  currentRoute: StoreRoute;
  purchases: PurchaseDefGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  championIDFilters: string[];
  hideOwnedPurchases: boolean;
  newPurchases: Dictionary<boolean>;
  stringTable: Dictionary<StringTableEntryDef>;
  storeTabConfigs: StoreTabConfig[];
  progressionNodes: string[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AStore extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { sortedPurchases: this.getPurchasesToDisplay(props.currentRoute) };
  }

  render() {
    return (
      <div className={Container}>
        <StoreNavMenu />
        <div className={FilterAndItemsContainer}>
          <StoreFilters purchases={this.state.sortedPurchases} />
          {this.renderList()}
        </div>
        {this.props.usingGamepad && this.props.usingGamepadInMainMenu && (
          <div className={ButtonPosition}>
            <Button
              type={'double-border'}
              text={
                <span className={`${ConsoleIcon} icon-xb-a`} /> +
                getStringTableValue(StringIDGeneralSelect, this.props.stringTable)
              }
              styles={ConsoleSelectSpacing}
              //TODO: Add onClick functionality
              onClick={null}
              disabled={false}
            />
            <Button
              type={'double-border'}
              text={
                <span className={`${ConsoleIcon} icon-xb-b`} /> +
                getStringTableValue(StringIDGeneralBack, this.props.stringTable)
              }
              //TODO: Add onClick functionality
              onClick={null}
              disabled={false}
            />
          </div>
        )}
      </div>
    );
  }

  private getPurchasesToDisplay(route: StoreRoute): PurchaseDefGQL[] {
    switch (route) {
      case StoreRoute.Rewards:
        return this.getEarnedRewards();
      case StoreRoute.Bundles:
        return this.getDisplayableBundles();
      case StoreRoute.Weapons:
        return this.getDisplayableItemsOfType(PerkType.Weapon);
      case StoreRoute.Skins:
        return this.getDisplayableItemsOfType(PerkType.Costume);
      case StoreRoute.Emotes:
        return this.getDisplayableItemsOfType(PerkType.Emote);
      case StoreRoute.Portraits:
        return this.getDisplayableItemsOfType(PerkType.Portrait);
      case StoreRoute.SprintFX:
        return this.getDisplayableItemsOfType(PerkType.SprintFX);
      case StoreRoute.QuestXP:
        return this.getDisplayableItemsOfType(PerkType.QuestXP);
      default:
        return [];
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // We cache the purchase list so that it doesn't change out from under the player if they purchase something
    // (owned items are sorted to the back of the list).
    if (this.props.currentRoute !== prevProps.currentRoute) {
      this.setState({ sortedPurchases: this.getPurchasesToDisplay(this.props.currentRoute) });
    }
  }

  private onSkinClick(purchase: PurchaseDefGQL) {
    // We show owned purchases, so don't let them re-purchase stuff!
    if (
      isPurchaseable(
        purchase,
        this.props.perksByID,
        this.props.ownedPerks,
        this.props.progressionNodes,
        this.props.quests,
        this.props.serverTimeDeltaMS
      )
    ) {
      this.props.dispatch(
        showRightPanel(<ConfirmPurchase purchase={purchase} />, <ConfirmPurchaseRewardPreviews purchase={purchase} />)
      );
    }

    // When we click into an item, we can mark it as 'seen', which clears any badging.
    const newNewPurchases = { ...this.props.newPurchases };
    delete newNewPurchases[purchase.id]; // This purchase is no longer new.
    this.props.dispatch(updateStoreNewPurchases(newNewPurchases));
    // Local storage data too.
    const seenPurchases = clientAPI.getSeenPurchases();
    seenPurchases[purchase.id] = true;
    clientAPI.setSeenPurchases(seenPurchases);
  }

  private perkMatchesChampionFilter(perk: PerkDefGQL): boolean {
    if (!perk.champion || this.props.championIDFilters.length === 0) {
      return true;
    }

    return this.props.championIDFilters.includes(perk.champion.id);
  }

  private getDisplayableItemsOfType(type: PerkType): PurchaseDefGQL[] {
    let items =
      this.props.purchases.filter((p) => {
        // Is it a single item? Exclude bundles.
        if (p.perks.length !== 1) {
          return false;
        }

        // If the user CAN'T make this purchase, don't bother showing it to them.
        if (
          !areLocksFulfilled(
            p.locks,
            this.props.ownedPerks,
            this.props.progressionNodes,
            this.props.quests,
            this.props.serverTimeDeltaMS
          )
        ) {
          return false;
        }

        const perk = this.props.perksByID[p.perks[0].perkID];
        return (
          // Is it the right perkType?
          perk.perkType === type
        );
      }) ?? [];

    this.sortPurchaseDefsInPlace(items);

    return items || [];
  }

  private sortPurchaseDefsInPlace(items: PurchaseDefGQL[]): void {
    // Precalculate ownership because it's expensive.
    const ownershipData: Dictionary<PurchaseOwnershipData> = {};
    items.forEach((purchase) => {
      ownershipData[purchase.id] = getPurchaseOwnershipData(purchase, this.props.perksByID, this.props.ownedPerks);
    });

    items.sort((a, b) => {
      // Explicit sortOrder gets highest priority.
      // Items with no value set in the sheets come through as zero, and we want those at the back.
      const aSortOrder = a.sortOrder ? a.sortOrder : Number.MAX_SAFE_INTEGER;
      const bSortOrder = b.sortOrder ? b.sortOrder : Number.MAX_SAFE_INTEGER;
      if (aSortOrder != bSortOrder) {
        return aSortOrder - bSortOrder;
      }

      // Owned items should go AFTER unowned items.
      const aOwnership = ownershipData[a.id];
      const bOwnership = ownershipData[b.id];
      if (aOwnership.status !== bOwnership.status) {
        if (aOwnership.status === OwnershipStatus.FullyOwned) {
          return 1;
        } else if (bOwnership.status === OwnershipStatus.FullyOwned) {
          return -1;
        }
      }

      // Lexographic Order
      return a.id.localeCompare(b.id);
    });
  }

  private getEarnedRewards(): PurchaseDefGQL[] {
    let items = this.props.purchases.filter((p) => {
      return (
        isFreeReward(p) &&
        isPurchaseable(
          p,
          this.props.perksByID,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        ) &&
        !(p.perks.length === 1 && this.props.perksByID[p.perks[0].perkID].perkType === PerkType.Key) // free battle pass keys are not shown here, they go on the battle pass page
      );
    });

    items &&
      items.sort((a, b) => {
        // Bundles first, so we don't get gaps in the list.
        const aIsBundle = a.perks.length > 1 ? 1 : 0;
        const bIsBundle = b.perks.length > 1 ? 1 : 0;

        if (aIsBundle != bIsBundle) {
          return bIsBundle - aIsBundle;
        }

        // New things before old things.
        const aIsNew = this.props.newPurchases[a.id] === undefined ? 0 : 1;
        const bIsNew = this.props.newPurchases[b.id] === undefined ? 0 : 1;

        return bIsNew - aIsNew;
      });

    return items || [];
  }

  private getDisplayableBundles(): PurchaseDefGQL[] {
    let items =
      this.props.purchases.filter((p) => {
        // If the user CAN'T make this purchase, don't bother showing it to them.
        if (
          !areLocksFulfilled(
            p.locks,
            this.props.ownedPerks,
            this.props.progressionNodes,
            this.props.quests,
            this.props.serverTimeDeltaMS
          )
        ) {
          return false;
        }

        const matchesChampionFilter = p.perks.reduce<boolean>((isMatch, perk) => {
          return isMatch || this.perkMatchesChampionFilter(this.props.perksByID[perk.perkID]);
        }, false);

        return (
          // Any purchase that grants more than one item is a Bundle.
          p.perks.length > 1 &&
          // If any perk in the bundle matches the filter, we can show the bundle.
          matchesChampionFilter
        );
      }) ?? [];

    this.sortPurchaseDefsInPlace(items);

    return items;
  }

  private renderList() {
    // Precalculate ownership because it's expensive.
    const ownershipData: Dictionary<PurchaseOwnershipData> = {};
    this.state.sortedPurchases.forEach((purchase) => {
      ownershipData[purchase.id] = getPurchaseOwnershipData(purchase, this.props.perksByID, this.props.ownedPerks);
    });

    // We do this filter at the last minute because we are using the unfiltered list for <StoreFilters>.
    const filteredPurchases = this.state.sortedPurchases.filter((p) => {
      // If we are hiding owned purchases, remove them from the list now.
      if (this.props.hideOwnedPurchases && ownershipData[p.id].status === OwnershipStatus.FullyOwned) {
        return false;
      }

      return !!p.perks.find((prd) => {
        const perk = this.props.perksByID[prd.perkID];
        return perk && this.perkMatchesChampionFilter(perk);
      });
    });

    if (filteredPurchases.length == 0) {
      return (
        <div className={ItemsAnimationContainer}>
          <div className={`${ItemsContainer} empty`} key={this.props.currentRoute.toString()}>
            <div className={EmptyPageMessage}>
              {getStringTableValue(StringIDStoreEmptyTab1, this.props.stringTable)}
            </div>
            <div className={EmptyPageMessage}>
              {getStringTableValue(StringIDStoreEmptyTab2, this.props.stringTable)}
            </div>
          </div>
        </div>
      );
    }

    // If a Layout is specified, split off enough items to feed the route's Featuring section, and show the rest in the normal small grid format.
    let featuredPurchases: PurchaseDefGQL[] = [];
    let remainingPurchases: PurchaseDefGQL[] = filteredPurchases;
    const layout = this.getFeaturingLayout();
    if (layout) {
      featuredPurchases = remainingPurchases.slice(0, StoreFeaturingLayoutItemCount[layout]);
      remainingPurchases = remainingPurchases.slice(StoreFeaturingLayoutItemCount[layout]);
    }

    return (
      <div className={ItemsAnimationContainer}>
        {featuredPurchases.length > 0 && (
          <StoreFeaturingPage
            layout={layout}
            purchases={featuredPurchases}
            onItemClick={this.onSkinClick.bind(this)}
            needsMoreHeader={remainingPurchases.length > 0}
          />
        )}
        {remainingPurchases.length > 0 && (
          <div className={ItemsContainer} key={this.props.currentRoute.toString()}>
            {remainingPurchases.map((purchase) => {
              return (
                <StoreItemCell sizeClassName={ItemSmall} purchase={purchase} onClick={this.onSkinClick.bind(this)} />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  private getFeaturingLayout(): StoreFeaturingLayout {
    // If the user has selected a filter, don't show any Featuring section.
    if (this.props.championIDFilters.length > 0) {
      return StoreFeaturingLayout.None;
    }

    const tabMap = {
      [StoreRoute.Bundles]: StoreTab.Bundle,
      [StoreRoute.Emotes]: StoreTab.Emote,
      [StoreRoute.None]: StoreTab.Invalid,
      [StoreRoute.Portraits]: StoreTab.Portrait,
      [StoreRoute.QuestXP]: StoreTab.QuestXP,
      [StoreRoute.Rewards]: StoreTab.Invalid,
      [StoreRoute.Skins]: StoreTab.Costume,
      [StoreRoute.SprintFX]: StoreTab.SprintFX,
      [StoreRoute.Weapons]: StoreTab.Weapon
    };

    const config = this.props.storeTabConfigs.find((config) => {
      return config.tab === tabMap[this.props.currentRoute];
    });

    return config?.layout ?? StoreFeaturingLayout.None;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { currentRoute, championIDFilters, hideOwnedPurchases, purchases, rmtPurchases, newPurchases, perksByID } =
    state.store;
  const { ownedPerks, quests, progressionNodes } = state.profile;
  const { stringTable } = state.stringTable;
  const { storeTabConfigs } = state.gameSettings;
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    currentRoute,
    purchases,
    rmtPurchases,
    ownedPerks,
    perksByID,
    championIDFilters,
    hideOwnedPurchases,
    newPurchases,
    stringTable,
    storeTabConfigs,
    quests,
    progressionNodes,
    serverTimeDeltaMS
  };
}

export const Store = connect(mapStateToProps)(AStore);

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StoreNavMenu } from './StoreNavMenu';
import { ConfirmPurchase } from '../../../rightPanel/ConfirmPurchase';
import { SkinItem } from './SkinItem';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { StoreRoute, updateStoreNewPurchases } from '../../../../redux/storeSlice';
import { Button } from '../../../shared/Button';
import {
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  RMTPurchaseDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { RealMoneyItem } from './RealMoneyItem';
import { ConfirmRealMoneyPurchase } from '../../../rightPanel/ConfirmRealMoneyPurchase';
import { BundleItem } from './BundleItem';
import { arePurchaseLocksMatched, isFreeReward, isPurchaseable } from '../../../../helpers/storeHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from 'redux';
import { storeLocalStore } from '../../../../localStorage/storeLocalStorage';
import { showRightPanel } from '../../../../redux/navigationSlice';
import {
  StringIDGeneralBack,
  StringIDGeneralSelect,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';

const Container = 'StartScreen-Store-Container';
const ItemsContainer = 'StartScreen-Store-ItemsContainer';
const ItemsAnimationContainer = 'StartScreen-Store-ItemsAnimationContainer';
const ButtonPosition = 'StartScreen-Store-ButtonPosition';
const ConsoleIcon = 'StartScreen-Store-ConsoleIcon';
const EmptyPageMessage = 'StartScreen-Store-EmptyPageMessage ';

const ConsoleSelectSpacing = 'StartScreen-Store-ConsoleSelectSpacing';

const StringIDStoreTabRewards = 'StoreTabRewards';
const StringIDStoreTabFeatured = 'StoreTabFeatured';
const StringIDStoreTabWeapons = 'StoreTabWeapons';
const StringIDStoreTabSkins = 'StoreTabSkins';
const StringIDStoreTabEmotes = 'StoreTabEmotes';
const StringIDStoreTabPortraits = 'StoreTabPortraits';
const StringIDStoreTabSprintFX = 'StoreTabSprintFX';
const StringIDStoreEmptyTab = 'StoreEmptyTab';
const StringIDStoreTabQuestXP = 'StoreTabQuestXP';

interface ReactProps {}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  currentRoute: StoreRoute;
  purchases: PurchaseDefGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  championIDFilter: string;
  newPurchases: Dictionary<boolean>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AStore extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={Container}>
        <StoreNavMenu />
        {this.renderRoute()}
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

  private onSkinClick(purchase: PurchaseDefGQL) {
    this.props.dispatch(showRightPanel(<ConfirmPurchase purchase={purchase} />));

    // When we click into an item, we can mark it as 'seen', which clears any badging.
    const newNewPurchases = { ...this.props.newPurchases };
    delete newNewPurchases[purchase.id]; // This purchase is no longer new.
    this.props.dispatch(updateStoreNewPurchases(newNewPurchases));
    // Local storage data too.
    const seenPurchases = storeLocalStore.getSeenPurchases();
    seenPurchases[purchase.id] = true;
    storeLocalStore.setSeenPurchases(seenPurchases);
  }

  private onRealMoneyClick(purchase: RMTPurchaseDefGQL) {
    this.props.dispatch(showRightPanel(<ConfirmRealMoneyPurchase purchase={purchase} />));
  }

  private renderRoute() {
    switch (this.props.currentRoute) {
      case StoreRoute.Rewards: {
        return this.renderList(
          this.props.currentRoute,
          this.getEarnedRewards(),
          getStringTableValue(StringIDStoreTabRewards, this.props.stringTable)
        );
      }
      case StoreRoute.Featured: {
        // For now, "featured" will just mean Bundles.
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableBundles(),
          getStringTableValue(StringIDStoreTabFeatured, this.props.stringTable)
        );
      }
      case StoreRoute.Weapons: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.Weapon),
          getStringTableValue(StringIDStoreTabWeapons, this.props.stringTable)
        );
      }
      case StoreRoute.Skins: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.Costume),
          getStringTableValue(StringIDStoreTabSkins, this.props.stringTable)
        );
      }
      case StoreRoute.Emotes: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.Emote),
          getStringTableValue(StringIDStoreTabEmotes, this.props.stringTable)
        );
      }
      case StoreRoute.Portraits: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.Portrait),
          getStringTableValue(StringIDStoreTabPortraits, this.props.stringTable)
        );
      }
      case StoreRoute.SprintFX: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.SprintFX),
          getStringTableValue(StringIDStoreTabSprintFX, this.props.stringTable)
        );
      }
      case StoreRoute.QuestXP: {
        return this.renderList(
          this.props.currentRoute,
          this.getPurchaseableItemsOfType(PerkType.QuestXP),
          getStringTableValue(StringIDStoreTabQuestXP, this.props.stringTable)
        );
      }
      case StoreRoute.Currency: {
        return this.renderRealMoneyList();
      }
    }
  }

  private perkMatchesChampionFilter(perk: PerkDefGQL): boolean {
    if (this.props.championIDFilter === null || !perk.champion) {
      return true;
    }

    return perk.champion.id === this.props.championIDFilter;
  }

  private getPurchaseableItemsOfType(type: PerkType): PurchaseDefGQL[] {
    let items = this.props.purchases.filter((p) => {
      // Rewards only go in the Rewards tab.
      if (isFreeReward(p)) {
        return false;
      }

      // Is it a single item? Exclude bundles.
      if (p.perks.length !== 1) {
        return false;
      }

      const perk = this.props.perksByID[p.perks[0].perkID];
      return (
        // Is it the right perkType?
        perk.perkType === type && this.perkMatchesChampionFilter(perk)
      );
    });
    // Do this second filter separately because it can be very costly.
    items = items.filter((p) => {
      return isPurchaseable(p, this.props.perksByID, this.props.ownedPerks);
    });

    items.sort((a, b) => {
      if (a.sortOrder != b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      // Lexographic Order
      return a.id.localeCompare(b.id);
    });

    return items || [];
  }

  private getEarnedRewards(): PurchaseDefGQL[] {
    let items = this.props.purchases.filter((p) => {
      return (
        isFreeReward(p) &&
        isPurchaseable(p, this.props.perksByID, this.props.ownedPerks) &&
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

  private getPurchaseableBundles(): PurchaseDefGQL[] {
    let items = this.props.purchases.filter((p) => {
      // Rewards only go in the Rewards tab.
      if (isFreeReward(p)) {
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
    });
    // Do this second filter separately because it can be very costly.
    items = items.filter((p) => {
      return isPurchaseable(p, this.props.perksByID, this.props.ownedPerks);
    });

    items &&
      items.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

    return items || [];
  }

  private renderRealMoneyList(): JSX.Element {
    // Find all valid purchases that cost RealMoney.
    const rmt = this.props.rmtPurchases
      .filter((purchase: RMTPurchaseDefGQL) => {
        return arePurchaseLocksMatched(purchase.locks, this.props.ownedPerks);
      })
      .sort((a: RMTPurchaseDefGQL, b: RMTPurchaseDefGQL) => {
        // Sorted from lowest Bux to highest Bux.
        return a.perks[0].qty - b.perks[0].qty;
      });

    return (
      <div className={ItemsAnimationContainer}>
        <div className={ItemsContainer} key={StoreRoute.Currency.toString()}>
          {rmt.map((storeItem) => {
            return <RealMoneyItem purchase={storeItem} onClick={this.onRealMoneyClick.bind(this, storeItem)} />;
          })}
        </div>
      </div>
    );
  }

  private renderList(route: StoreRoute, purchases: PurchaseDefGQL[], tabName: string) {
    if (purchases.length == 0) {
      return (
        <div className={ItemsAnimationContainer}>
          <div className={ItemsContainer} key={route.toString()}>
            <span className={EmptyPageMessage}>
              {getTokenizedStringTableValue(StringIDStoreEmptyTab, this.props.stringTable, { REWARD_TYPE: tabName })}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className={ItemsAnimationContainer}>
        <div className={ItemsContainer} key={route.toString()}>
          {purchases.map((purchase) => {
            if (purchase.perks.length > 1) {
              return <BundleItem purchase={purchase} onClick={this.onSkinClick.bind(this)} />;
            } else {
              return <SkinItem purchase={purchase} onClick={this.onSkinClick.bind(this)} />;
            }
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { currentRoute, championIDFilter, purchases, rmtPurchases, newPurchases, perksByID } = state.store;
  const { ownedPerks } = state.profile;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    currentRoute,
    purchases,
    rmtPurchases,
    ownedPerks,
    perksByID,
    championIDFilter,
    newPurchases,
    stringTable
  };
}

export const Store = connect(mapStateToProps)(AStore);

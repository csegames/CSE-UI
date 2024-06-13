/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StoreNavMenu } from './StoreNavMenu';
import { ConfirmPurchase } from '../../../rightPanel/ConfirmPurchase';
import { StoreItemSingle } from './StoreItemSingle';
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
import { StoreItemBundle } from './StoreItemBundle';
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
const StringIDStoreTabBundles = 'StoreTabBundles';
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
    // We show owned purchases, so don't let them re-purchase stuff!
    if (isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks)) {
      this.props.dispatch(showRightPanel(<ConfirmPurchase purchase={purchase} />));
    }

    // When we click into an item, we can mark it as 'seen', which clears any badging.
    const newNewPurchases = { ...this.props.newPurchases };
    delete newNewPurchases[purchase.id]; // This purchase is no longer new.
    this.props.dispatch(updateStoreNewPurchases(newNewPurchases));
    // Local storage data too.
    const seenPurchases = storeLocalStore.getSeenPurchases();
    seenPurchases[purchase.id] = true;
    storeLocalStore.setSeenPurchases(seenPurchases);
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
      case StoreRoute.Bundles: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableBundles(),
          getStringTableValue(StringIDStoreTabBundles, this.props.stringTable)
        );
      }
      case StoreRoute.Weapons: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.Weapon),
          getStringTableValue(StringIDStoreTabWeapons, this.props.stringTable)
        );
      }
      case StoreRoute.Skins: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.Costume),
          getStringTableValue(StringIDStoreTabSkins, this.props.stringTable)
        );
      }
      case StoreRoute.Emotes: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.Emote),
          getStringTableValue(StringIDStoreTabEmotes, this.props.stringTable)
        );
      }
      case StoreRoute.Portraits: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.Portrait),
          getStringTableValue(StringIDStoreTabPortraits, this.props.stringTable)
        );
      }
      case StoreRoute.SprintFX: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.SprintFX),
          getStringTableValue(StringIDStoreTabSprintFX, this.props.stringTable)
        );
      }
      case StoreRoute.QuestXP: {
        return this.renderList(
          this.props.currentRoute,
          this.getDisplayableItemsOfType(PerkType.QuestXP),
          getStringTableValue(StringIDStoreTabQuestXP, this.props.stringTable)
        );
      }
    }
  }

  private perkMatchesChampionFilter(perk: PerkDefGQL): boolean {
    if (this.props.championIDFilter === null || !perk.champion) {
      return true;
    }

    return perk.champion.id === this.props.championIDFilter;
  }

  private getDisplayableItemsOfType(type: PerkType): PurchaseDefGQL[] {
    let items =
      this.props.purchases.filter((p) => {
        // Is it a single item? Exclude bundles.
        if (p.perks.length !== 1) {
          return false;
        }

        // If the user CAN'T make this purchase, don't bother showing it to them.
        if (!arePurchaseLocksMatched(p.locks, this.props.ownedPerks)) {
          return false;
        }

        const perk = this.props.perksByID[p.perks[0].perkID];
        return (
          // Is it the right perkType?
          perk.perkType === type && this.perkMatchesChampionFilter(perk)
        );
      }) ?? [];

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

  private getDisplayableBundles(): PurchaseDefGQL[] {
    let items =
      this.props.purchases.filter((p) => {
        // If the user CAN'T make this purchase, don't bother showing it to them.
        if (!arePurchaseLocksMatched(p.locks, this.props.ownedPerks)) {
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

    items.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });

    return items;
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
              return <StoreItemBundle purchase={purchase} onClick={this.onSkinClick.bind(this)} />;
            } else {
              return <StoreItemSingle purchase={purchase} onClick={this.onSkinClick.bind(this)} />;
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

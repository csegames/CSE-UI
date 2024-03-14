/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { StoreRoute, updateStoreCurrentRoute, updateStoreNewPurchases } from '../../../../redux/storeSlice';
import { Dispatch } from 'redux';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { StoreChampionFilterDropdown } from './StoreChampionFilterDropdown';
import { PerkDefGQL, PerkType, PurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { isFreeReward, isPurchaseable } from '../../../../helpers/storeHelpers';
import { Header } from '../../../shared/Header';
import { Button } from '../../../shared/Button';
import { storeLocalStore } from '../../../../localStorage/storeLocalStorage';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'StartScreen-Store-StoreNavMenu-Container';
const HeaderStyles = 'StartScreen-Store-StoreNavMenu-HeaderStyles';
const BadgeStyle = 'StartScreen-Store-StoreNavMenu-Badge';
const ChampionDropdown = 'StartScreen-Store-StoreNavMenu-ChampionDropdown';

const StringIDChampionInfoDisplayMarkAllSeenTitle = 'ChampionInfoDisplayMarkAllSeenTitle';
const StringIDStoreTabRewards = 'StoreTabRewards';
const StringIDStoreTabFeatured = 'StoreTabFeatured';
const StringIDStoreTabWeapons = 'StoreTabWeapons';
const StringIDStoreTabSkins = 'StoreTabSkins';
const StringIDStoreTabEmotes = 'StoreTabEmotes';
const StringIDStoreTabPortraits = 'StoreTabPortraits';
const StringIDStoreTabSprintFX = 'StoreTabSprintFX';
const StringIDStoreTabCurrency = 'StoreTabCurrency';
const StringIDStoreTabQuestXP = 'StoreTabQuestXP';

interface ReactProps {
  dispatch?: Dispatch;
}

interface InjectedProps {
  currentRoute: StoreRoute;
  purchases: PurchaseDefGQL[];
  newPurchases: Dictionary<boolean>;
  perks: PerkDefGQL[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AStoreNavMenu extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Container}>
        {Object.keys(this.props.newPurchases).length > 0 ? (
          <Button
            type={'double-border'}
            text={getStringTableValue(StringIDChampionInfoDisplayMarkAllSeenTitle, this.props.stringTable)}
            onClick={this.markAllSeen.bind(this)}
            disabled={false}
          />
        ) : null}
        {this.hasUnclaimedRewards() ? this.renderNavItem(StoreRoute.Rewards) : null}
        {this.renderNavItem(StoreRoute.Featured)}
        {this.renderNavItem(StoreRoute.Weapons)}
        {this.renderNavItem(StoreRoute.Skins)}
        {this.renderNavItem(StoreRoute.Emotes)}
        {this.renderNavItem(StoreRoute.Portraits)}
        {this.renderNavItem(StoreRoute.SprintFX)}
        {this.renderNavItem(StoreRoute.QuestXP)}
        {this.renderNavItem(StoreRoute.Currency)}
        <StoreChampionFilterDropdown styles={ChampionDropdown} />
      </div>
    );
  }

  componentDidMount(): void {
    // Pick the initial route once per launch.
    if (this.props.currentRoute === StoreRoute.None) {
      const route = this.hasUnclaimedRewards() ? StoreRoute.Rewards : StoreRoute.Featured;
      this.props.dispatch(updateStoreCurrentRoute(route));
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // Make sure we get off of the empty Rewards page after the user claims their last reward.
    if (this.props.currentRoute === StoreRoute.Rewards && !this.hasUnclaimedRewards()) {
      this.props.dispatch(updateStoreCurrentRoute(StoreRoute.Featured));
    }
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  private onClick(route: StoreRoute) {
    this.props.dispatch(updateStoreCurrentRoute(route));
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  private hasUnclaimedRewards(): boolean {
    const reward = this.props.purchases.find((purchase) => {
      return isFreeReward(purchase) && isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks);
    });

    return reward !== undefined;
  }

  private renderNavItem(route: StoreRoute, extraJSX?: JSX.Element | JSX.Element[]) {
    return (
      <Header
        key={StoreRoute[route]}
        className={HeaderStyles}
        isBadged={this.isRouteBadged(route)}
        isSelected={route === this.props.currentRoute}
        onClick={this.onClick.bind(this, route)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        extraBadgeStyle={BadgeStyle}
      >
        {this.getTabTitle(route)}
        {extraJSX || ''}
      </Header>
    );
  }

  private getTabTitle(route: StoreRoute): string {
    switch (route) {
      case StoreRoute.Rewards: {
        return getStringTableValue(StringIDStoreTabRewards, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Featured: {
        return getStringTableValue(StringIDStoreTabFeatured, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Weapons: {
        return getStringTableValue(StringIDStoreTabWeapons, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Skins: {
        return getStringTableValue(StringIDStoreTabSkins, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Emotes: {
        return getStringTableValue(StringIDStoreTabEmotes, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Portraits: {
        return getStringTableValue(StringIDStoreTabPortraits, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.SprintFX: {
        return getStringTableValue(StringIDStoreTabSprintFX, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.Currency: {
        return getStringTableValue(StringIDStoreTabCurrency, this.props.stringTable).toUpperCase();
      }
      case StoreRoute.QuestXP: {
        return getStringTableValue(StringIDStoreTabQuestXP, this.props.stringTable).toUpperCase();
      }
    }
  }

  private isRouteBadged(route: StoreRoute): boolean {
    switch (route) {
      case StoreRoute.Rewards: {
        return true;
      }
      case StoreRoute.Currency:
      case StoreRoute.QuestXP: {
        return false;
      }
      case StoreRoute.Emotes: {
        return this.hasNewPurchaseOfType(PerkType.Emote);
      }
      case StoreRoute.Featured: {
        return this.hasNewBundles();
      }
      case StoreRoute.Skins: {
        return this.hasNewPurchaseOfType(PerkType.Costume);
      }
      case StoreRoute.Weapons: {
        return this.hasNewPurchaseOfType(PerkType.Weapon);
      }
      case StoreRoute.SprintFX: {
        return this.hasNewPurchaseOfType(PerkType.SprintFX);
      }
      case StoreRoute.Portraits: {
        return this.hasNewPurchaseOfType(PerkType.Portrait);
      }
      default: {
        console.error(`Attempted to badge an unknown StoreRoute (${StoreRoute[route]})`);
        return false;
      }
    }
  }

  private hasNewPurchaseOfType(type: PerkType): boolean {
    const newPurchase = Object.keys(this.props.newPurchases).find((purchaseID) => {
      const purchase = this.props.purchases.find((p) => {
        return p.id === purchaseID;
      });
      // If we can't find a purchase matching this ID, then that purchase won't be showing in the Store,
      // so no need to badge for it.
      if (purchase === undefined) {
        return false;
      }
      // If the perks list is bigger than one, then this is a bundle purchase.
      if (purchase.perks.length !== 1) {
        return false;
      }
      // And obviously, it has to match the type.
      if (this.props.perksByID[purchase.perks[0].perkID].perkType !== type) {
        return false;
      }
      // Finally, if it's not purchaseable, then it won't show in the store, so no need to badge for it.
      // This check inspects time-based locks, so it will refresh every time Redux pings it.
      return isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks) && !isFreeReward(purchase);
    });

    return newPurchase !== undefined;
  }

  private hasNewBundles(): boolean {
    const newBundlePurchase = Object.keys(this.props.newPurchases).find((purchaseID) => {
      const purchase = this.props.purchases.find((p) => {
        return p.id === purchaseID;
      });
      // If we can't find a purchase matching this ID, then that purchase won't be showing in the Store,
      // so no need to badge for it.
      if (purchase === undefined) {
        return false;
      }
      // If the perks list doesn't have at least two items, it's not a bundle.
      if (purchase.perks.length <= 1) {
        return false;
      }
      // Finally, if it's not purchaseable, then it won't show in the store, so no need to badge for it.
      // This check inspects time-based locks, so it will refresh every time Redux pings it.
      return isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks) && !isFreeReward(purchase);
    });

    return newBundlePurchase !== undefined;
  }

  private markAllSeen(): void {
    // loop through the currently badged items and update the locally stored data.
    const seenPurchases = storeLocalStore.getSeenPurchases();
    for (const [key] of Object.entries(this.props.newPurchases)) {
      seenPurchases[key] = true;
    }
    storeLocalStore.setSeenPurchases(seenPurchases);

    // now update redux that it is empty
    const emptyNewPurchases: Dictionary<boolean> = {};
    this.props.dispatch(updateStoreNewPurchases(emptyNewPurchases));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRoute, purchases, newPurchases, perks, perksByID } = state.store;
  const { ownedPerks } = state.profile;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    currentRoute,
    purchases,
    newPurchases,
    perks,
    ownedPerks,
    perksByID,
    stringTable
  };
}

export const StoreNavMenu = connect(mapStateToProps)(AStoreNavMenu);

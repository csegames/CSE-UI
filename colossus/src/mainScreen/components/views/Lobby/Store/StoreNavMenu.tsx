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
import {
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  QuestGQL,
  RMTPurchaseDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { isFreeReward, isPurchaseable } from '../../../../helpers/storeHelpers';
import { Header } from '../../../shared/Header';
import { Button } from '../../../shared/Button';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { Overlay, showOverlay } from '../../../../redux/navigationSlice';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'StartScreen-Store-StoreNavMenu-Container';
const HeaderStyles = 'StartScreen-Store-StoreNavMenu-HeaderStyles';
const BadgeStyle = 'StartScreen-Store-StoreNavMenu-Badge';
const BorderStyle = 'StartScreen-Store-StoreNavMenu-Border';
const TabsStyle = 'StartScreen-Store-StoreNavMenu-TabsContainer';
const NavRow = 'StartScreen-Store-StoreNavMenu-NavRow';
const SideButtonContainer = 'StartScreen-Store-StoreNavMenu-SideButtonContainer';
const BuyGemsButton = 'StartScreen-Store-StoreNavMenu-BuyGemsButton';
const BuyGemsButtonContent = 'StartScreen-Store-StoreNavMenu-BuyGemsButtonContent';
const BuyGemsButtonLabel = 'StartScreen-Store-StoreNavMenu-BuyGemsButtonLabel';
const BuyGemsButtonIcon = 'StartScreen-Store-StoreNavMenu-BuyGemsButtonIcon';

const StringIDChampionInfoDisplayMarkAllSeenTitle = 'ChampionInfoDisplayMarkAllSeenTitle';
const StringIDStoreTabRewards = 'StoreTabRewards';
const StringIDStoreTabBundles = 'StoreTabBundles';
const StringIDStoreTabWeapons = 'StoreTabWeapons';
const StringIDStoreTabSkins = 'StoreTabSkins';
const StringIDStoreTabEmotes = 'StoreTabEmotes';
const StringIDStoreTabPortraits = 'StoreTabPortraits';
const StringIDStoreTabSprintFX = 'StoreTabSprintFX';
const StringIDStoreTabQuestXP = 'StoreTabQuestXP';
const StringIDStoreBuyGems = 'StoreBuyGems';

const TabSounds = {
  [StoreRoute.Bundles]: SoundEvents.PLAY_UI_STOREMENU_BUNDLES_SELECT,
  [StoreRoute.Emotes]: SoundEvents.PLAY_UI_STOREMENU_EMOTES_SELECT,
  [StoreRoute.None]: 0,
  [StoreRoute.Portraits]: SoundEvents.PLAY_UI_STOREMENU_PORTRAITS_SELECT,
  [StoreRoute.QuestXP]: SoundEvents.PLAY_UI_STOREMENU_POTIONS_SELECT,
  [StoreRoute.Rewards]: SoundEvents.PLAY_UI_STOREMENU_REWARDS_SELECT,
  [StoreRoute.Skins]: SoundEvents.PLAY_UI_STOREMENU_SKINS_SELECT,
  [StoreRoute.SprintFX]: SoundEvents.PLAY_UI_STOREMENU_SPRINTS_SELECT,
  [StoreRoute.Weapons]: SoundEvents.PLAY_UI_STOREMENU_WEAPONS_SELECT
};

interface ReactProps {
  dispatch?: Dispatch;
}

interface InjectedProps {
  currentRoute: StoreRoute;
  purchases: PurchaseDefGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  newPurchases: Dictionary<boolean>;
  perks: PerkDefGQL[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  progressionNodes: string[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
}

type Props = ReactProps & InjectedProps;

class AStoreNavMenu extends React.Component<Props> {
  render(): JSX.Element {
    const isRMTAvailable = (this.props.rmtPurchases?.length ?? 0) > 0;

    return (
      <div className={Container}>
        <div className={SideButtonContainer}>
          {Object.keys(this.props.newPurchases).length > 0 ? (
            <Button
              type={'double-border'}
              text={getStringTableValue(StringIDChampionInfoDisplayMarkAllSeenTitle, this.props.stringTable)}
              onClick={this.markAllSeen.bind(this)}
              disabled={false}
            />
          ) : null}
        </div>
        <div className={NavRow}>
          <div className={BorderStyle} />
          <div className={`${BorderStyle} bottom`} />
          <div className={TabsStyle}>
            {this.hasUnclaimedRewards() ? this.renderNavItem(StoreRoute.Rewards) : null}
            {this.renderNavItem(StoreRoute.Bundles)}
            {this.renderNavItem(StoreRoute.Skins)}
            {this.renderNavItem(StoreRoute.Weapons)}
            {this.renderNavItem(StoreRoute.SprintFX)}
            {this.renderNavItem(StoreRoute.Emotes)}
            {this.renderNavItem(StoreRoute.Portraits)}
            {this.renderNavItem(StoreRoute.QuestXP)}
          </div>
        </div>
        <div className={SideButtonContainer}>
          {isRMTAvailable && (
            <Button
              type={'primary'}
              styles={BuyGemsButton}
              text={
                <div className={BuyGemsButtonContent}>
                  <div className={BuyGemsButtonLabel}>
                    {getStringTableValue(StringIDStoreBuyGems, this.props.stringTable)}
                  </div>
                  <div className={`${BuyGemsButtonIcon} fs-icon-misc-gem`} />
                </div>
              }
              onClick={this.onBuyGemsClicked.bind(this)}
              disabled={false}
            />
          )}
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    // Pick the initial route once per launch.
    if (this.props.currentRoute === StoreRoute.None) {
      const route = this.hasUnclaimedRewards() ? StoreRoute.Rewards : StoreRoute.Bundles;
      this.props.dispatch(updateStoreCurrentRoute(route));
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // Make sure we get off of the empty Rewards page after the user claims their last reward.
    if (this.props.currentRoute === StoreRoute.Rewards && !this.hasUnclaimedRewards()) {
      this.props.dispatch(updateStoreCurrentRoute(StoreRoute.Bundles));
    }
  }

  private onBuyGemsClicked(): void {
    this.props.dispatch?.(showOverlay(Overlay.PurchaseGems));
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private onClick(route: StoreRoute) {
    this.props.dispatch(updateStoreCurrentRoute(route));
    game.playGameSound(TabSounds[route]);
  }

  private hasUnclaimedRewards(): boolean {
    const reward = this.props.purchases.find((purchase) => {
      return (
        isFreeReward(purchase) &&
        isPurchaseable(
          purchase,
          this.props.perksByID,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        )
      );
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
      case StoreRoute.Bundles: {
        return getStringTableValue(StringIDStoreTabBundles, this.props.stringTable).toUpperCase();
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
      case StoreRoute.QuestXP: {
        return false;
      }
      case StoreRoute.Emotes: {
        return this.hasNewPurchaseOfType(PerkType.Emote);
      }
      case StoreRoute.Bundles: {
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
      return (
        isPurchaseable(
          purchase,
          this.props.perksByID,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        ) && !isFreeReward(purchase)
      );
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
      return (
        isPurchaseable(
          purchase,
          this.props.perksByID,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        ) && !isFreeReward(purchase)
      );
    });

    return newBundlePurchase !== undefined;
  }

  private markAllSeen(): void {
    // loop through the currently badged items and update the locally stored data.
    const seenPurchases = clientAPI.getSeenPurchases();
    for (const [key] of Object.entries(this.props.newPurchases)) {
      seenPurchases[key] = true;
    }
    clientAPI.setSeenPurchases(seenPurchases);

    // now update redux that it is empty
    const emptyNewPurchases: Dictionary<boolean> = {};
    this.props.dispatch(updateStoreNewPurchases(emptyNewPurchases));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRoute, purchases, rmtPurchases, newPurchases, perks, perksByID } = state.store;
  const { ownedPerks, quests, progressionNodes } = state.profile;
  const { serverTimeDeltaMS } = state.clock;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    currentRoute,
    purchases,
    rmtPurchases,
    newPurchases,
    perks,
    ownedPerks,
    perksByID,
    stringTable,
    quests,
    progressionNodes,
    serverTimeDeltaMS
  };
}

export const StoreNavMenu = connect(mapStateToProps)(AStoreNavMenu);

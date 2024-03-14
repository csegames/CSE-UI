/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  PerkDefGQL,
  PerkGQL,
  PurchaseDefGQL,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { isFreeReward, isPurchaseable } from '../../../helpers/storeHelpers';
import { navigateTo, LobbyView } from '../../../redux/navigationSlice';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';
import { updateSelectedChampion } from '../../../redux/championInfoSlice';
import { RootState } from '../../../redux/store';
import { Header } from '../../shared/Header';
import { QuestsByType } from '../../../redux/questSlice';
import { getAllPendingBattlePassRewards, isBattlePassVisible } from './BattlePass/BattlePassUtils';
import { WarningMessage } from './WarningMessage';
import { FittingView } from '../../../../shared/components/FittingView';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { battlePassLocalStore } from '../../../localStorage/battlePassLocalStorage';
import { formatCountdown } from '../../../helpers/timeHelpers';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';

const Container = 'StartScreen-NavMenu-Container';
const ContentSizer = 'StartScreen-NavMenu-ContentSizer';
const TabContentContainer = 'StartScreen-NavMenu-TabContentContainer';
const ButtonIcon = 'StartScreen-NavMenu-ButtonIcon';
const TabSubtitle = 'StartScreen-NavMenu-TabSubtitle';

const StringIDLobbyViewPlay = 'LobbyViewPlay';
const StringIDLobbyViewChampions = 'LobbyViewChampions';
const StringIDLobbyViewBattlePass = 'LobbyViewBattlePass';
const StringIDLobbyViewCareerStats = 'LobbyViewCareerStats';
const StringIDLobbyViewStore = 'LobbyViewStore';

const StringIDBattlePassStartsIn = 'BattlePassStartsIn';
const StringIDBattlePassStartsSoon = 'BattlePassStartsSoon';
const StringIDBattlePassNavComingSoon = 'BattlePassNavComingSoon';

interface ReactProps {}

interface InjectedProps extends FeatureFlags.Source {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  selectedView: LobbyView;
  newPurchases: Dictionary<boolean>;
  purchases: PurchaseDefGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  perks: PerkGQL[];
  ownedPerks: Dictionary<number>;
  newEquipment: Dictionary<boolean>;
  hasPurchasables: boolean;
  questDefs: QuestsByType;
  quests: QuestGQL[];
  currentBattlePass: QuestDefGQL;
  nextBattlePass: QuestDefGQL;
  previousBattlePass: QuestDefGQL;
  stringTable: Dictionary<StringTableEntryDef>;
  minuteTicker: number;
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ANavMenu extends React.Component<Props> {
  render() {
    return (
      <FittingView className={Container} contentClassName={ContentSizer}>
        {this.tryGetGamepadLeftIcon()}
        {this.renderRouteButton(LobbyView.Play, <WarningMessage />)}
        {this.renderRouteButton(LobbyView.Champions)}
        {this.renderRouteButton(LobbyView.BattlePass, this.renderBattlePassStatusText())}
        {this.renderRouteButton(LobbyView.CareerStats)}
        {/* {this.renderRouteButton(LobbyView.Leaderboards)} */}
        {FeatureFlags.Store.isEnabled(this.props) &&
          (game.isSteamBuild || this.props.hasPurchasables) &&
          this.renderRouteButton(LobbyView.Store)}
        {this.tryGetGamepadRightIcon()}
      </FittingView>
    );
  }

  private tryGetGamepadLeftIcon(): JSX.Element {
    if (this.props.usingGamepad && this.props.usingGamepadInMainMenu) {
      return <div className={`${ButtonIcon} icon-xb-lb`} />;
    }
    return null;
  }

  private tryGetGamepadRightIcon(): JSX.Element {
    if (this.props.usingGamepad && this.props.usingGamepadInMainMenu) {
      return <div className={`${ButtonIcon} icon-xb-rb`} />;
    }
    return null;
  }

  private renderBattlePassStatusText(): JSX.Element {
    if (!this.props.currentBattlePass) {
      // If no current battlepass, but there is an upcoming battlepass, show "STARTS IN xxd xxh".
      if (this.props.nextBattlePass && isBattlePassVisible(this.props.nextBattlePass, this.props.serverTimeDeltaMS)) {
        return <div className={TabSubtitle}>{this.getBattlePassCountdown(this.props.nextBattlePass)}</div>;
      }
      // If there is no current, next, OR previous battlepass, then the first official season hasn't
      // entered Preview yet.
      if (!this.props.previousBattlePass) {
        return (
          <div className={TabSubtitle}>
            {getStringTableValue(StringIDBattlePassNavComingSoon, this.props.stringTable)}
          </div>
        );
      }
    }

    return null;
  }

  private getBattlePassCountdown(bp: QuestDefGQL): string {
    const startDate = new Date(
      bp.questLock?.find((lock) => {
        return !!lock.startTime;
      })?.startTime
    );

    const startDelta = Math.max(0, startDate.getTime() - getServerTimeMS(this.props.serverTimeDeltaMS));
    const seconds = startDelta / 1000;

    if (seconds >= 60) {
      return getTokenizedStringTableValue(StringIDBattlePassStartsIn, this.props.stringTable, {
        COUNTDOWN: formatCountdown(seconds, this.props.stringTable)
      });
    } else {
      return getStringTableValue(StringIDBattlePassStartsSoon, this.props.stringTable);
    }
  }

  private onViewClick(view: LobbyView) {
    // When changing routes, any non-confirmed champion stuff gets canceled.
    if (this.props.selectedView !== view) {
      this.props.dispatch(updateSelectedChampion(null));
    }
    this.props.dispatch(navigateTo(view));

    switch (view) {
      case LobbyView.Champions: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_OPEN);
        break;
      }
      case LobbyView.CareerStats: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CAREER_OPEN);
        break;
      }
      case LobbyView.Store: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
        break;
      }
      default: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
        break;
      }
    }
  }

  private onMouseEnterRoute() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  private renderRouteButton(view: LobbyView, extraJSX?: JSX.Element | JSX.Element[]) {
    const isSelected = this.props.selectedView === view;
    return (
      <Header
        isSelected={isSelected}
        isBadged={this.isViewBadged(view)}
        onClick={() => this.onViewClick(view)}
        onMouseEnter={this.onMouseEnterRoute.bind(this)}
        isDisabled={this.getIsTabDisabled(view)}
      >
        <div className={TabContentContainer}>{this.getLobbyTabName(view)}</div>
        {extraJSX || ''}
      </Header>
    );
  }

  private getIsTabDisabled(view: LobbyView): boolean {
    switch (view) {
      case LobbyView.BattlePass: {
        // If there are no battlepasses to view, disable the battlepass tab.
        return (
          !this.props.currentBattlePass &&
          (!this.props.nextBattlePass ||
            !isBattlePassVisible(this.props.nextBattlePass, this.props.serverTimeDeltaMS)) &&
          !this.props.previousBattlePass
        );
      }
      case LobbyView.Play:
      case LobbyView.Champions:
      case LobbyView.Store:
      case LobbyView.CareerStats:
        return false;
      default:
        console.error(`Unexpected LobbyView option ${view}`);
        return false;
    }
  }

  private getLobbyTabName(view: LobbyView): string {
    const stringID = this.getLobbyFieldStringID(view);
    switch (view) {
      case LobbyView.BattlePass: {
        // If there is a current BP, use its short name (if it has one).
        if (this.props.currentBattlePass?.shortName?.length > 0) {
          return this.props.currentBattlePass.shortName;
        }
        // Else if there is a future BP, use the next BP's short name (if it has one).
        if (!this.props.currentBattlePass) {
          if (
            isBattlePassVisible(this.props.nextBattlePass, this.props.serverTimeDeltaMS) &&
            this.props.nextBattlePass?.shortName?.length > 0
          ) {
            return this.props.nextBattlePass.shortName;
          }
        }
        // Else fall through and use the generic string from the string table like every other tab.
      }
      case LobbyView.Play:
      case LobbyView.Champions:
      case LobbyView.Store:
      case LobbyView.CareerStats:
        return getStringTableValue(stringID, this.props.stringTable);
      default:
        console.error(`Unexpected LobbyView option ${view}`);
        return '';
    }
  }

  private getLobbyFieldStringID(view: LobbyView): string {
    switch (view) {
      case LobbyView.Play:
        return StringIDLobbyViewPlay;
      case LobbyView.Champions:
        return StringIDLobbyViewChampions;
      case LobbyView.BattlePass:
        return StringIDLobbyViewBattlePass;
      case LobbyView.Store:
        return StringIDLobbyViewStore;
      case LobbyView.CareerStats:
        return StringIDLobbyViewCareerStats;
      default:
        console.error(`Unexpected LobbyView option ${view}`);
        return '';
    }
  }

  private isViewBadged(route: LobbyView): boolean {
    switch (route) {
      case LobbyView.Champions: {
        const hasNewEquipment =
          Object.keys(this.props.newEquipment).find((perkID) => {
            return this.props.perksByID[perkID];
          }) !== undefined;

        return hasNewEquipment;
      }
      case LobbyView.Store: {
        // If there are any unclaimed rewards, badge the store tab.
        if (
          this.props.purchases.find((purchase) => {
            return isFreeReward(purchase) && isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks);
          })
        ) {
          return true;
        }
        // If there are any unlocked "new" purchaseables in the Store, badge the store tab.
        const purchaseIDs = Object.keys(this.props.newPurchases);
        if (purchaseIDs.length > 0) {
          const unlockedPurchaseID = purchaseIDs.find((pid) => {
            const purchase = this.props.purchases.find((p) => {
              return p.id === pid;
            });

            if (purchase === undefined) {
              // No purchase matching this ID.  Should never happen, but if it does then the
              // the user obviously won't be seeing a matching purchase in the store.
              return false;
            } else {
              // The purchase exists.  Next we check if the user can see it.
              return isPurchaseable(purchase, this.props.perksByID, this.props.ownedPerks);
            }
          });

          // If we found any unseen, purchaseable things, we should badge.
          return unlockedPurchaseID !== undefined;
        } else {
          return false;
        }
      }
      case LobbyView.BattlePass: {
        // If there is a new, unseen-as-of-yet BattlePass, badge it!
        if (this.props.currentBattlePass) {
          const lastSeenBattlePassID = battlePassLocalStore.getLastSeenBattlePassID();
          if (lastSeenBattlePassID !== this.props.currentBattlePass.id) {
            return true;
          }
        }

        // If there are unclaimed rewards, we need a badge.
        return (
          getAllPendingBattlePassRewards(this.props.questDefs?.BattlePass, this.props.perks, this.props.quests)
            ?.length > 0
        );
      }
      default: {
        return false;
      }
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const lobbyView = state.navigation.lobbyView;
  const { perksByID, purchases, newPurchases, newEquipment, hasPurchasables } = state.store;
  const featureFlags = state.featureFlags;
  const { ownedPerks, perks, quests } = state.profile;
  const questDefs = state.quests.quests;
  const { currentBattlePass, nextBattlePass, previousBattlePass } = state.quests;
  const { stringTable } = state.stringTable;
  const { minuteTicker, serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    selectedView: lobbyView,
    newPurchases,
    purchases,
    perksByID,
    perks,
    ownedPerks,
    newEquipment,
    featureFlags,
    hasPurchasables,
    questDefs,
    quests,
    currentBattlePass,
    nextBattlePass,
    previousBattlePass,
    stringTable,
    minuteTicker,
    serverTimeDeltaMS
  };
}

export const NavMenu = connect(mapStateToProps)(ANavMenu);

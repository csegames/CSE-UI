/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { PerkDefGQL, PerkGQL, RMTPurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { Dispatch } from 'redux';
import { BUX_PERK_ID } from '../../helpers/storeHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { FeatureFlags } from '../../redux/featureFlagsSlice';
import { LobbyView, navigateTo } from '../../redux/navigationSlice';
import { RootState } from '../../redux/store';
import { StoreRoute, updateStoreCurrentRoute } from '../../redux/storeSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

const BuxWalletContainer = 'StartScreen-Store-BuxWallet-BuxWalletContainer';
const BuxWalletIcon = 'StartScreen-Store-BuxWallet-BuxWalletIcon';
const BuxWalletCount = 'StartScreen-Store-BuxWallet-BuxWalletCount';
const BuxWalletLabel = 'StartScreen-Store-BuxWallet-BuxWalletLabel';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {}

interface InjectedProps extends FeatureFlags.Source {
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: PerkGQL[];
  rmtPurchases: RMTPurchaseDefGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ABuxWallet extends React.Component<Props> {
  public render() {
    const { children, className, perksByID, ownedPerks, featureFlags, rmtPurchases, onClick, ...otherProps } =
      this.props;
    return (
      FeatureFlags.Store.isEnabled(this.props) &&
      (this.getBuxCount() > 0 || this.props.rmtPurchases.length > 0) && (
        <div className={`${BuxWalletContainer} ${className ?? ''}`} onClick={this.onClick.bind(this)} {...otherProps}>
          <img className={BuxWalletIcon} src={this.getBuxIconURL()} />
          <span className={BuxWalletCount}>{addCommasToNumber(this.getBuxCount())}</span>
          <span className={BuxWalletLabel}>{this.getBuxName()}</span>
        </div>
      )
    );
  }

  private getBuxCount(): number {
    const buxPerk = this.props.ownedPerks.find((p) => p.id === BUX_PERK_ID);
    return buxPerk ? buxPerk.qty : 0;
  }

  private getBuxName(): string {
    if (this.props.perksByID && this.props.perksByID[BUX_PERK_ID]) {
      return this.props.perksByID[BUX_PERK_ID].name;
    } else {
      return 'CSE'; // This isn't localized, since it should never show up and is the company name.
    }
  }

  private getBuxIconURL(): string {
    if (this.props.perksByID && this.props.perksByID[BUX_PERK_ID]) {
      return this.props.perksByID[BUX_PERK_ID].iconURL;
    } else {
      return 'images/MissingAsset.png';
    }
  }

  private onClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else {
      // Set the route first, in case the user hasn't visited the store yet this session.
      this.props.dispatch(updateStoreCurrentRoute(StoreRoute.Currency));
      this.props.dispatch(navigateTo(LobbyView.Store));
      game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID, rmtPurchases } = state.store;
  const featureFlags = state.featureFlags;
  const ownedPerks = state.profile?.perks ?? [];

  return {
    ...ownProps,
    ownedPerks,
    featureFlags,
    rmtPurchases,
    perksByID
  };
}

export const BuxWallet = connect(mapStateToProps)(ABuxWallet);

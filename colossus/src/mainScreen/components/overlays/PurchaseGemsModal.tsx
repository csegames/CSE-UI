/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Overlay, hideOverlay, showError } from '../../redux/navigationSlice';
import { PerkDefGQL, RMTPurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralCancel, getStringTableValue } from '../../helpers/stringTableHelpers';
import { arePurchaseLocksMatched } from '../../helpers/storeHelpers';
import { RealMoneyItem } from '../views/Lobby/Store/RealMoneyItem';
import { Button } from '../shared/Button';
import { startProfileRefresh } from '../../redux/profileSlice';
import { ItemGainedToaster } from '../views/Lobby/Store/ItemGainedToaster';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

const Container = 'PurchaseGemsModal-Container';
const Title = 'PurchaseGemsModal-Title';
const Message = 'PurchaseGemsModal-Message';
const BundlesContainer = 'PurchaseGemsModal-BundlesContainer';
const BundleContainer = 'PurchaseGemsModal-BundleContainer';
const CancelButton = 'PurchaseGemsModal-CancelButton';

const StringIDPurchaseGemsTitle = 'StorePurchaseGemsTitle';
const StringIDConfirmRealMoneyPurchaseOverlayUnavailableTitle = 'ConfirmRealMoneyPurchaseOverlayUnavailableTitle';
const StringIDConfirmRealMoneyPurchaseOverlayUnavailableMessage = 'ConfirmRealMoneyPurchaseOverlayUnavailableMessage';
const StringIDConfirmRealMoneyPurchasePurchaseConflictTitle = 'ConfirmRealMoneyPurchasePurchaseConflictTitle';
const StringIDConfirmRealMoneyPurchasePurchaseConflictMessage = 'ConfirmRealMoneyPurchasePurchaseConflictMessage';
const StringIDConfirmRealMoneyPurchasePurchaseFailed = 'ConfirmRealMoneyPurchasePurchaseFailed';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  rmtPurchases: RMTPurchaseDefGQL[];
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  ownedPerks: Dictionary<number>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APurchaseGemsModal extends React.Component<Props> {
  private purchaseEVH: ListenerHandle = null;

  public render(): React.ReactNode {
    const purchases = this.getSortedPurchases();
    return (
      // Unsetting the height lets the modal calculate its size based on content.
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride='unset'>
        <div className={Container}>
          <div className={Title}>{getStringTableValue(StringIDPurchaseGemsTitle, this.props.stringTable)}</div>
          <div className={Message}>{this.props.perksByID[purchases[0]?.perks?.[0]?.perkID]?.description ?? ''}</div>
          <div className={BundlesContainer}>{purchases.map(this.renderPurchase.bind(this))}</div>
          <Button
            styles={CancelButton}
            type={'blue-outline'}
            text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private renderPurchase(purchase: RMTPurchaseDefGQL, index: number): React.ReactNode {
    return (
      <RealMoneyItem
        className={BundleContainer}
        key={index}
        purchase={purchase}
        onPurchaseClick={this.onPurchaseClick.bind(this, purchase)}
      />
    );
  }

  private getSortedPurchases(): RMTPurchaseDefGQL[] {
    // Find all valid purchases that cost RealMoney.
    const rmt = this.props.rmtPurchases
      .filter((purchase: RMTPurchaseDefGQL) => {
        return arePurchaseLocksMatched(purchase.locks, this.props.ownedPerks);
      })
      .sort((a: RMTPurchaseDefGQL, b: RMTPurchaseDefGQL) => {
        // Sorted from lowest Bux to highest Bux.
        return a.perks[0].qty - b.perks[0].qty;
      });

    return rmt;
  }

  private async onClose(): Promise<void> {
    this.props.dispatch(hideOverlay(Overlay.PurchaseGems));
  }

  private onPurchaseClick(purchase: RMTPurchaseDefGQL) {
    // Using an explicit boolean check so that older clients (where this boolean is undefined) will be unaffected.
    if (game.isSteamOverlayEnabled === false) {
      this.props.dispatch(
        showError({
          severity: 'standard',
          title: getStringTableValue(StringIDConfirmRealMoneyPurchaseOverlayUnavailableTitle, this.props.stringTable),
          message: getStringTableValue(
            StringIDConfirmRealMoneyPurchaseOverlayUnavailableMessage,
            this.props.stringTable
          ),
          code: 'overlay_disabled'
        })
      );
      return;
    }
    if (this.purchaseEVH !== null) {
      this.props.dispatch(
        showError({
          severity: 'standard',
          title: getStringTableValue(StringIDConfirmRealMoneyPurchasePurchaseConflictTitle, this.props.stringTable),
          message: getStringTableValue(StringIDConfirmRealMoneyPurchasePurchaseConflictMessage, this.props.stringTable),
          code: 'purchase_conflict'
        })
      );
      return;
    }
    this.setState({ isPurchasing: true });

    this.purchaseEVH = game.onSteamPurchaseComplete(this.onPurchaseComplete.bind(this, purchase));
    game.startSteamPurchase(purchase.id);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
  }

  private async onPurchaseComplete(purchase: RMTPurchaseDefGQL, failed: boolean, canceled: boolean, error: string) {
    this.purchaseEVH.close();
    this.purchaseEVH = null;

    // If canceled, just leave this modal open.
    if (canceled) {
      this.setState({ isPurchasing: false });
      return;
    }

    // If failed, show an error dialog over this modal.
    if (failed) {
      this.props.dispatch(
        showError({
          severity: 'critical',
          title: getStringTableValue(StringIDConfirmRealMoneyPurchasePurchaseFailed, this.props.stringTable),
          message: error,
          code: 'purchase_failed'
        })
      );
      this.setState({ isPurchasing: false });
      return;
    }

    // The server says the purchase was completed successfully, so refetch to update all local state.
    this.props.dispatch(startProfileRefresh());

    // Purchasing is only complete after we have updated our inventory locally.
    this.setState({ isPurchasing: false });

    // Close this Overlay and then trigger an ItemGainedToaster.
    this.props.dispatch(hideOverlay(Overlay.PurchaseGems));
    window.setTimeout(() => {
      purchase.perks.forEach((perkReward) => {
        const perk = this.props.perksByID[perkReward.perkID];
        game.trigger('show-bottom-toaster', <ItemGainedToaster perk={perk} perkCount={perkReward.qty} />);
      });
    }, 750);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { stringTable } = state.stringTable;
  const { perksByID, rmtPurchases } = state.store;
  const { ownedPerks } = state.profile;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    stringTable,
    perksByID,
    rmtPurchases,
    ownedPerks
  };
}

export const PurchaseGemsModal = connect(mapStateToProps)(APurchaseGemsModal);

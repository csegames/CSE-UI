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
import { PerkDefGQL, RMTPurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import { showError } from '../../redux/navigationSlice';
import { hideRightPanel } from '../../redux/navigationSlice';
import { ItemGainedToaster } from '../views/Lobby/Store/ItemGainedToaster';
import { BuxWallet } from '../shared/BuxWallet';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { startProfileRefresh } from '../../redux/profileSlice';
import { Dictionary } from '@reduxjs/toolkit';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { StringIDGeneralCancel, getStringTableValue } from '../../helpers/stringTableHelpers';

const Container = 'StartScreen-Store-ConfirmRealMoneyPurchase-Container';
const ContentCenterer = 'StartScreen-Store-ConfirmRealMoneyPurchase-ContentCenterer';
const Title = 'StartScreen-Store-ConfirmRealMoneyPurchase-Title';
const Name = 'StartScreen-Store-ConfirmRealMoneyPurchase-Name';
const Description = 'StartScreen-Store-ConfirmRealMoneyPurchase-Description';
const PackageIcon = 'StartScreen-Store-ConfirmRealMoneyPurchase-PackageIcon';
const PriceContainer = 'StartScreen-Store-ConfirmRealMoneyPurchase-PriceContainer';
const PriceLabel = 'StartScreen-Store-ConfirmRealMoneyPurchase-PriceLabel';
const PriceTag = 'StartScreen-Store-ConfirmRealMoneyPurchase-PriceTag';
const ButtonsContainer = 'StartScreen-Store-ConfirmRealMoneyPurchase-ButtonsContainer';
const ButtonStyle = 'StartScreen-Store-ConfirmRealMoneyPurchase-Button';

const ConsoleIcon = 'StartScreen-Store-ConfirmRealMoneyPurchase-ConsoleIcon';

const StringIDConfirmRealMoneyPurchaseTitle = 'ConfirmRealMoneyPurchaseTitle';
const StringIDConfirmRealMoneyPurchaseOverlayUnavailableTitle = 'ConfirmRealMoneyPurchaseOverlayUnavailableTitle';
const StringIDConfirmRealMoneyPurchaseOverlayUnavailableMessage = 'ConfirmRealMoneyPurchaseOverlayUnavailableMessage';
const StringIDConfirmRealMoneyPurchasePurchaseConflictTitle = 'ConfirmRealMoneyPurchasePurchaseConflictTitle';
const StringIDConfirmRealMoneyPurchasePurchaseConflictMessage = 'ConfirmRealMoneyPurchasePurchaseConflictMessage';
const StringIDConfirmRealMoneyPurchasePurchaseFailed = 'ConfirmRealMoneyPurchasePurchaseFailed';
const StringIDConfirmPurchaseBuyButton = 'ConfirmPurchaseBuyButton';
const StringIDConfirmPurchaseConfirm = 'ConfirmPurchaseConfirm';

// We persist the purchase handle at the file level in case the user closes
// this dialog before the Steam response arrives.
let purchaseEVH: ListenerHandle = null;

interface ReactProps {
  purchase: RMTPurchaseDefGQL;
}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isPurchasing: boolean;
}

class AConfirmRealMoneyPurchase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isPurchasing: false
    };
  }

  render() {
    const priceString = '$' + (this.props.purchase.centCost / 100).toFixed(2);
    return (
      <div id='ConfirmRealMoneyPurchase_Container' className={Container}>
        <div className={ContentCenterer}>
          <div className={Title}>{getStringTableValue(StringIDConfirmPurchaseConfirm, this.props.stringTable)}</div>
          <div className={Name}>{this.getPackageTitle()}</div>
          <div className={Description}>{this.getPackageDescription()}</div>
          <img className={PackageIcon} src={this.getPackageImageURL()} />
          <div className={PriceContainer}>
            <div className={PriceLabel}>
              {getStringTableValue(StringIDConfirmRealMoneyPurchaseTitle, this.props.stringTable)}
            </div>
            <div className={PriceTag}>{priceString}</div>
          </div>
          <div className={ButtonsContainer}>
            {this.getPurchaseButton()}
            {this.getCancelButton()}
          </div>
        </div>
        <BuxWallet />
      </div>
    );
  }

  private getPackageTitle(): string {
    // If the PurchaseDef has a title, use that.
    if (this.props.purchase.name && this.props.purchase.name.length > 0) {
      return this.props.purchase.name;
    }

    // Perk name shouldn't be used for RMT, only for other purchase types.

    // If all else fails, just calculate a title manually.
    const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];
    return `${this.props.purchase.perks[0].qty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${perk.name}`;
  }

  private getPackageDescription(): string {
    // If the PurchaseDef has a description, use that.
    if (this.props.purchase.description && this.props.purchase.description.length > 0) {
      return this.props.purchase.description;
    }

    // If the PerkDef has a description, use that.
    if (this.props.purchase.perks && this.props.purchase.perks.length > 0) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];
      if (perk.description && perk.description.length > 0) {
        return perk.description;
      }
    }

    // If all else fails, no description.
    return '';
  }

  private getPackageImageURL(): string {
    // If the PurchaseDef has an icon, use that.
    if (this.props.purchase.iconURL && this.props.purchase.iconURL.length > 0) {
      return this.props.purchase.iconURL;
    }

    // If the PerkDef has an icon, use that.
    if (this.props.purchase.perks && this.props.purchase.perks.length > 0) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];

      if (perk.iconURL && perk.iconURL.length > 0) {
        return perk.iconURL;
      }
    }

    // If all else fails, at least we can show SOMETHING.
    return 'images/fullscreen/gamestats/card-default.jpg';
  }

  private getPurchaseButton(): JSX.Element {
    const useGamepad = this.props.usingGamepad && this.props.usingGamepadInMainMenu;
    const canPurchase = game.canStartSteamPurchase && !this.state.isPurchasing;

    return (
      <Button
        text={
          <>
            {useGamepad && <span className={`${ConsoleIcon} icon-xb-a`} />}{' '}
            {getStringTableValue(StringIDConfirmPurchaseBuyButton, this.props.stringTable)}
          </>
        }
        type='primary'
        onClick={this.onPurchaseClick.bind(this)}
        styles={ButtonStyle}
        disabled={!canPurchase}
      />
    );
  }

  private getCancelButton(): JSX.Element {
    const useGamepad = this.props.usingGamepad && this.props.usingGamepadInMainMenu;

    return (
      <Button
        text={
          <>
            {useGamepad && <span className={`${ConsoleIcon} icon-xb-b`} />}{' '}
            {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
          </>
        }
        type='blue-outline'
        onClick={this.onCancelClick.bind(this)}
        styles={ButtonStyle}
      />
    );
  }

  private onPurchaseClick() {
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
    if (purchaseEVH !== null) {
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

    purchaseEVH = game.onSteamPurchaseComplete(this.onPurchaseComplete.bind(this));
    game.startSteamPurchase(this.props.purchase.id);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
  }

  private async onPurchaseComplete(failed: boolean, canceled: boolean, error: string) {
    purchaseEVH.close();
    purchaseEVH = null;

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

    // Close this RightModal and then trigger an ItemGainedToaster.
    this.props.dispatch(hideRightPanel());
    setTimeout(() => {
      this.props.purchase.perks.forEach((perkReward) => {
        const perk = this.props.perksByID[perkReward.perkID];
        game.trigger('show-bottom-toaster', <ItemGainedToaster perk={perk} perkCount={perkReward.qty} />);
      });
    }, 750);
  }

  private onCancelClick() {
    this.props.dispatch(hideRightPanel());
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    stringTable,
    perksByID
  };
}

export const ConfirmRealMoneyPurchase = connect(mapStateToProps)(AConfirmRealMoneyPurchase);

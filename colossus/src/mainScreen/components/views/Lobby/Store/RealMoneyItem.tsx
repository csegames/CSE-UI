/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PerkDefGQL, RMTPurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';

const Container = 'StartScreen-Store-RealMoneyItem-Container';
const PackageIcon = 'StartScreen-Store-RealMoneyItem-PackageIcon';
const CostContainer = 'StartScreen-Store-RealMoneyItem-CostContainer';
const BuxAmount = 'StartScreen-Store-RealMoneyItem-BuxAmount';

const Cost = 'StartScreen-Store-RealMoneyItem-Cost';

interface ReactProps {
  purchase: RMTPurchaseDefGQL;
  onClick: (purchase: RMTPurchaseDefGQL) => void;

  disabled?: boolean;
  width?: string;
  height?: string;
  margin?: string;
}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

export class ARealMoneyItem extends React.Component<Props> {
  render(): JSX.Element {
    const disabledClass = this.props.disabled ? 'disabled' : 'not-disabled';
    // TODO: Once we build out a system for ComingSoon, we can hook this into it.
    const isComingSoonClass = false ? 'isComingSoon' : '';

    return (
      <div
        className={`${Container} ${disabledClass} ${isComingSoonClass}`}
        style={{
          width: 'calc(25% - 0.93vmin)',
          height: 'calc(50% - 0.93vmin)',
          marginLeft: '0.93vmin',
          marginTop: '0.93vmin'
        }}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
      >
        <img className={PackageIcon} src={this.getPackageImageURL()} />
        <div className={CostContainer}>
          <div className={BuxAmount}>{this.getPackageTitle()}</div>
          <div className={Cost}>${(this.props.purchase.centCost / 100).toFixed(2)}</div>
        </div>
      </div>
    );
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  private onClick() {
    if (this.props.disabled) return;

    this.props.onClick(this.props.purchase);
  }

  private getPackageTitle(): string {
    // If the PurchaseDef has a title, use that.
    if (this.props.purchase.name && this.props.purchase.name.length > 0) {
      return this.props.purchase.name;
    }

    // If all else fails, just calculate a title manually.
    const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];
    return `${this.props.purchase.perks[0].qty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${perk.name}`;
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
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID } = state.store;

  return {
    ...ownProps,
    perksByID
  };
}

export const RealMoneyItem = connect(mapStateToProps)(ARealMoneyItem);

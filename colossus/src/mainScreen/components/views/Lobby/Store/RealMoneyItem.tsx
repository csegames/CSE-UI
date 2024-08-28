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
import { Button } from '../../../shared/Button';

const Container = 'StartScreen-Store-RealMoneyItem-Container';
const PackageIcon = 'StartScreen-Store-RealMoneyItem-PackageIcon';
const CostContainer = 'StartScreen-Store-RealMoneyItem-CostContainer';
const BonusDescription = 'StartScreen-Store-RealMoneyItem-BonusDescription';
const BuxRow = 'StartScreen-Store-RealMoneyItem-BuxRow';
const BuxIcon = 'StartScreen-Store-RealMoneyItem-BuxIcon';
const BuxAmount = 'StartScreen-Store-RealMoneyItem-BuxAmount';

const CostButton = 'StartScreen-Store-RealMoneyItem-CostButton';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  purchase: RMTPurchaseDefGQL;
  onPurchaseClick: (purchase: RMTPurchaseDefGQL) => void;
  disabled?: boolean;
}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

export class ARealMoneyItem extends React.Component<Props> {
  render(): JSX.Element {
    const { className, purchase, onPurchaseClick, disabled, ...otherProps } = this.props;

    const disabledClass = this.props.disabled ? 'disabled' : 'not-disabled';
    // TODO: Once we build out a system for ComingSoon, we can hook this into it.
    const isComingSoonClass = false ? 'isComingSoon' : '';

    return (
      <div
        className={`${Container} ${disabledClass} ${isComingSoonClass} ${className}`}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        {...otherProps}
      >
        <img className={PackageIcon} src={this.getPackageImageURL()} />
        <div className={CostContainer}>
          <div className={BonusDescription}>{this.props.purchase?.bonusDescription ?? ''}</div>
          <div className={BuxRow}>
            <div className={`${BuxIcon} fs-icon-misc-gem`} />
            <div className={BuxAmount}>{this.getPackageTitle()}</div>
          </div>
          <Button
            type={'primary'}
            styles={CostButton}
            text={`$${(this.props.purchase.centCost / 100).toFixed(2)}`}
            onClick={this.onClick.bind(this)}
          ></Button>
        </div>
      </div>
    );
  }

  private onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseEnter?.(e);
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private onClick(e: React.MouseEvent<HTMLDivElement>) {
    if (this.props.disabled) return;

    this.props.onClick?.(e);
    this.props.onPurchaseClick(this.props.purchase);
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

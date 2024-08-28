/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PerkDefGQL, PurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { StoreItemInfo } from './StoreItemInfo';

const Container = 'StartScreen-Store-ItemCell-Container';
const Image = 'StartScreen-Store-ItemCell-Image';
const Background = 'StartScreen-Store-ItemCell-Background';
const NewIcon = 'StartScreen-Store-ItemCell-NewIcon';

interface ReactProps {
  purchase: PurchaseDefGQL;
  sizeClassName: string;
  onClick: (purchase: PurchaseDefGQL) => void;
}

interface InjectedProps {
  newPurchases: Dictionary<boolean>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AStoreItemCell extends React.Component<Props> {
  render(): JSX.Element {
    // TODO: Once we build out a system for ComingSoon, we can hook this into it.
    const comingSoonClass = false ? 'isComingSoon' : '';

    const imageURL = this.getPackageImageURL();
    const bgURL = this.getBackgroundURL();

    // If the only image is the background, then IT should grow instead of the foreground on hover.
    const bgGrows = bgURL.length > 0 && imageURL.length === 0;
    const isBgDark = bgURL.length > 0 && imageURL.length > 0;

    return (
      <div
        className={`${Container} ${comingSoonClass} ${this.props.sizeClassName}`}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onClick={this.onClick.bind(this)}
      >
        <img
          className={`${Background} ${bgGrows ? 'GrowsOnHover' : ''} ${isBgDark ? 'Dark' : ''}`}
          src={this.getBackgroundURL()}
        />
        <img className={`${Image} GrowsOnHover`} src={this.getPackageImageURL()} />
        <StoreItemInfo purchase={this.props.purchase} />
        {this.isNew() && <StarBadge className={NewIcon} />}
      </div>
    );
  }

  private shouldUsePurchaseImagery(): boolean {
    const hasPackageIcon = this.props.purchase.iconURL && this.props.purchase.iconURL.length > 0;
    const hasPackageBackground = this.props.purchase.backgroundURL && this.props.purchase.backgroundURL.length > 0;

    return hasPackageIcon || hasPackageBackground;
  }

  private shouldUsePerkImagery(): boolean {
    if (this.shouldUsePurchaseImagery()) {
      return false;
    }

    const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];
    const hasPerkIcon = perk?.iconURL && perk.iconURL.length > 0;
    const hasPerkBackground = perk?.backgroundURL && perk.backgroundURL.length > 0;

    return hasPerkIcon || hasPerkBackground;
  }

  private getPackageImageURL(): string {
    if (this.shouldUsePurchaseImagery()) {
      return this.props.purchase.iconURL;
    } else if (this.shouldUsePerkImagery()) {
      return this.props.perksByID[this.props.purchase.perks[0].perkID].iconURL;
    } else {
      return 'images/fullscreen/startscreen/store/bundles/champ.jpg';
    }
  }

  private getBackgroundURL(): string {
    if (this.shouldUsePurchaseImagery()) {
      return this.props.purchase.backgroundURL;
    } else if (this.shouldUsePerkImagery()) {
      return this.props.perksByID[this.props.purchase.perks[0].perkID].backgroundURL;
    } else {
      return '';
    }
  }

  private isNew(): boolean {
    return this.props.newPurchases[this.props.purchase.id] === true;
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private onClick() {
    this.props.onClick(this.props.purchase);

    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { newPurchases, perksByID } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    newPurchases,
    perksByID,
    stringTable
  };
}

export const StoreItemCell = connect(mapStateToProps)(AStoreItemCell);

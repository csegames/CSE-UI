/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { StoreItemInfo } from './StoreItemInfo';

const Container = 'StartScreen-Store-BundleItem-Container';
const Image = 'StartScreen-Store-BundleItem-Image';
const NewIcon = 'StartScreen-Store-BundleItem-NewIcon';

interface ReactProps {
  purchase: PurchaseDefGQL;
  onClick: (purchase: PurchaseDefGQL) => void;
}

interface InjectedProps {
  newPurchases: Dictionary<boolean>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AStoreItemBundle extends React.Component<Props> {
  render(): JSX.Element {
    // TODO: Once we build out a system for ComingSoon, we can hook this into it.
    const comingSoonClass = false ? 'isComingSoon' : '';
    return (
      <div
        className={`${Container} ${comingSoonClass}`}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onClick={this.onClick.bind(this)}
      >
        <img className={`${Image} GrowsOnHover`} src={this.getPackageImageURL()} />
        <StoreItemInfo purchase={this.props.purchase} />
        {this.isNew() && <StarBadge className={NewIcon} />}
      </div>
    );
  }

  private getPackageImageURL(): string {
    if (this.props.purchase.iconURL && this.props.purchase.iconURL.length > 0) {
      return this.props.purchase.iconURL;
    } else {
      return 'images/fullscreen/startscreen/store/bundles/champ.jpg';
    }
  }

  private isNew(): boolean {
    return this.props.newPurchases[this.props.purchase.id] === true;
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  private onClick() {
    this.props.onClick(this.props.purchase);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { newPurchases } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    newPurchases,
    stringTable
  };
}

export const StoreItemBundle = connect(mapStateToProps)(AStoreItemBundle);

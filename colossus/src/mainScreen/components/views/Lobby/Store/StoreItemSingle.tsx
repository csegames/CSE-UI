/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { EquipmentItem } from '../ChampionProfile/EquipmentItem';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PurchaseDefGQL, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { StringTableEntryDef, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { StoreItemInfo } from './StoreItemInfo';

const ItemStyleOverride = 'StartScreen-Store-SkinItem-ItemStyleOverride';
const XPPotionStyleOverride = 'StartScreen-Store-XPPotionItem-ItemStyleOverride';
const NewIcon = 'StartScreen-Store-SkinItem-NewIcon';

interface ReactProps {
  purchase: PurchaseDefGQL;
  onClick: (purchase: PurchaseDefGQL) => void;

  disabled?: boolean;
}

interface InjectedProps {
  newPurchases: Dictionary<boolean>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AStoreitemSingle extends React.Component<Props> {
  render(): JSX.Element {
    const styleOverride =
      this.props.perksByID[this.props.purchase.perks[0].perkID]?.perkType == PerkType.QuestXP
        ? XPPotionStyleOverride
        : ItemStyleOverride;
    return (
      <EquipmentItem
        disabled={this.props.disabled}
        perk={this.props.perksByID[this.props.purchase.perks[0].perkID]}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        styles={styleOverride}
        overrideBackgroundURL={this.props.purchase.iconURL}
      >
        <StoreItemInfo purchase={this.props.purchase} />
        {this.isNew() && <StarBadge className={NewIcon} />}
      </EquipmentItem>
    );
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  private onClick() {
    if (this.props.disabled) return;

    this.props.onClick(this.props.purchase);
  }

  private isNew(): boolean {
    return this.props.newPurchases[this.props.purchase.id] === true;
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

export const StoreItemSingle = connect(mapStateToProps)(AStoreitemSingle);

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { EquipmentItem } from '../ChampionProfile/EquipmentItem';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import {
  PurchaseDefGQL,
  ChampionGQL,
  ChampionCostumeInfo,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { getThumbnailURLForChampion } from '../../../../../mainScreen/helpers/characterHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { isFreeReward } from '../../../../helpers/storeHelpers';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { StringTableEntryDef, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const InfoContainer = 'StartScreen-Store-SkinItem-InfoContainer';
const CostContentLeft = 'StartScreen-Store-SkinItem-CostContentLeft';
const ChampionPortrait = 'StartScreen-Store-SkinItem-ChampionPortrait';
const CostAmount = 'StartScreen-Store-SkinItem-CostAmount';
const CostIcon = 'StartScreen-Store-SkinItem-CostIcon';
const CostLabel = 'StartScreen-Store-SkinItem-CostLabel';
const ItemStyleOverride = 'StartScreen-Store-SkinItem-ItemStyleOverride';
const XPPotionStyleOverride = 'StartScreen-Store-XPPotionItem-ItemStyleOverride';
const CostContainer = 'StartScreen-Store-SkinItem-CostContainer';
const Name = 'StartScreen-Store-SkinItem-Name';
const NewIcon = 'StartScreen-Store-SkinItem-NewIcon';
const RewardBannerContainer = 'StartScreen-Store-RewardBannerContainer';

const StringIDStoreFree = 'StoreFree';

interface ReactProps {
  purchase: PurchaseDefGQL;
  onClick: (purchase: PurchaseDefGQL) => void;

  disabled?: boolean;
}

interface InjectedProps {
  newPurchases: Dictionary<boolean>;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ASkinItem extends React.Component<Props> {
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
        <div className={`${InfoContainer}`}>
          <div className={CostContentLeft}>
            <div className={Name}>{this.getPackageTitle()}</div>
            {this.getCosts()}
          </div>
          {this.getChampionPortrait()}
          {this.getRewardBanner()}
        </div>
        {this.isNew() && <StarBadge className={NewIcon} />}
      </EquipmentItem>
    );
  }

  private getCosts(): JSX.Element[] {
    if (isFreeReward(this.props.purchase)) {
      // Free stuff, so no cost labels!
      return null;
    } else {
      return this.props.purchase.costs.map((cost) => {
        const perk = this.props.perksByID[cost.perkID];
        return (
          <div className={CostContainer}>
            <img className={CostIcon} src={perk.iconURL.length > 0 ? perk.iconURL : 'images/MissingAsset.png'} />
            <span className={CostAmount}>{addCommasToNumber(cost.qty)}</span>
            <span className={CostLabel}>{perk.name}</span>
          </div>
        );
      });
    }
  }

  private getRewardBanner(): JSX.Element {
    if (isFreeReward(this.props.purchase)) {
      return (
        <div className={RewardBannerContainer}>{getStringTableValue(StringIDStoreFree, this.props.stringTable)}</div>
      );
    } else {
      return null;
    }
  }

  private getChampionPortrait(): JSX.Element {
    if (!this.props.purchase) {
      return null;
    }

    const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];
    if (!perk || !perk.champion) {
      return null;
    }

    let portraitURL = getThumbnailURLForChampion(
      this.props.championCostumes,
      this.props.champions,
      this.props.perksByID,
      perk.champion
    );

    return <img className={ChampionPortrait} src={portraitURL} />;
  }

  private getPackageTitle(): string {
    // If the PurchaseDef has a title, use that.
    if (this.props.purchase.name && this.props.purchase.name.length > 0) {
      return this.props.purchase.name;
    }

    // If the PerkDef has a title, use that.
    if (this.props.purchase.perks && this.props.purchase.perks.length > 0) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];

      if (perk && perk.name && perk.name.length > 0) {
        return perk.name;
      }
    }

    console.error('Title Failed to Load');

    return '';
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
  const { championCostumes } = state.championInfo;
  const { champions } = state.profile;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    newPurchases,
    championCostumes,
    champions,
    perksByID,
    stringTable
  };
}

export const SkinItem = connect(mapStateToProps)(ASkinItem);

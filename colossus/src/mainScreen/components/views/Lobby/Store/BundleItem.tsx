/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import {
  PurchaseDefGQL,
  ChampionGQL,
  ChampionCostumeInfo,
  ClassDefRef,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { getThumbnailURLForChampion } from '../../../../../mainScreen/helpers/characterHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { isFreeReward } from '../../../../helpers/storeHelpers';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'StartScreen-Store-BundleItem-Container';
const Image = 'StartScreen-Store-BundleItem-Image';
const CostContainer = 'StartScreen-Store-BundleItem-CostContainer';
const Name = 'StartScreen-Store-BundleItem-Name';
const InfoContainer = 'StartScreen-Store-BundleItem-InfoContainer';
const CostContentLeft = 'StartScreen-Store-BundleItem-CostContentLeft';
const CostAmount = 'StartScreen-Store-BundleItem-CostAmount';
const CostLabel = 'StartScreen-Store-BundleItem-CostLabel';
const CostIcon = 'StartScreen-Store-BundleItem-CostIcon';
const ChampionPortrait = 'StartScreen-Store-BundleItem-ChampionPortrait';
const NewIcon = 'StartScreen-Store-BundleItem-NewIcon';
const RewardBannerContainer = 'StartScreen-Store-RewardBannerContainer';

const StringIDStoreFree = 'StoreFree';

interface ReactProps {
  purchase: PurchaseDefGQL;
  onClick: (purchase: PurchaseDefGQL) => void;
}

interface InjectedProps {
  newPurchases: Dictionary<boolean>;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ABundleItem extends React.Component<Props> {
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
        <div className={`${InfoContainer}`}>
          <div className={CostContentLeft}>
            <div className={Name}>{this.props.purchase.name}</div>
            {this.getCosts()}
          </div>
          {this.getChampionPortrait()}
          {this.getRewardBanner()}
        </div>
        {this.isNew() && <StarBadge className={NewIcon} />}
      </div>
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
            <span className={CostAmount}>{`${addCommasToNumber(cost.qty)}`}</span>
            <span className={CostLabel}>{perk.name}</span>
          </div>
        );
      });
    }
  }

  private getPackageImageURL(): string {
    if (this.props.purchase.iconURL && this.props.purchase.iconURL.length > 0) {
      return this.props.purchase.iconURL;
    } else {
      return 'images/fullscreen/startscreen/store/bundles/champ.jpg';
    }
  }

  private getChampionPortrait(): JSX.Element {
    // Figure out which champions are relevant to this bundle.
    const champions: ClassDefRef[] = [];
    this.props.purchase.perks.forEach((perk) => {
      const perkDef = this.props.perksByID[perk.perkID];
      if (perkDef.champion && champions.indexOf(perkDef.champion) == -1) {
        champions.push(perkDef.champion);
      }
    });

    // If all non-empty champions are the same, use that champion for the portrait.
    if (champions.length === 1) {
      let portraitURL = getThumbnailURLForChampion(
        this.props.championCostumes,
        this.props.champions,
        this.props.perksByID,
        champions[0]
      );
      return <img className={ChampionPortrait} src={portraitURL} />;
    }

    // If there are NO champions or multiple champions, don't show a portrait at all.
    return null;
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

export const BundleItem = connect(mapStateToProps)(ABundleItem);

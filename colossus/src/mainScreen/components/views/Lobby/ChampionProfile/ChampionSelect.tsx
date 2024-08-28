/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ProfileModel } from '../../../../redux/profileSlice';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { updateSelectedChampion } from '../../../../redux/championInfoSlice';
import { Dispatch } from 'redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  PerkDefGQL,
  QuestGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { getIsBadgedForChampionSelect } from '../../../../helpers/badgingUtils';

const Container = 'ChampionProfile-ChampionSelect-Container';
const ChampionContainer = 'ChampionProfile-ChampionSelect-ChampionContainer';
const Image = 'ChampionProfile-ChampionSelect-Image';
const Badge = 'ChampionProfile-ChampionSelect-Badge';
const StarIcon = 'ChampionProfile-ChampionSelect-StarIcon';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  champions: ChampionInfo[];
  championCostumes: ChampionCostumeInfo[];
  profile: ProfileModel;
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: Dictionary<number>;
  newEquipment: Dictionary<boolean>;
  quests: QuestGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AChampionSelect extends React.Component<Props> {
  public render() {
    return (
      <div className={Container}>
        {this.props.champions.map((champion) => {
          const costume = this.getEquippedCostumeForChampion(champion);
          const thumbnailURL = (costume && costume.thumbnailURL) || '';

          const selectedClassName = champion.id === this.props.selectedChampion.id ? 'selected' : '';
          const isBadgedEV = getIsBadgedForChampionSelect(
            champion,
            this.props.champions,
            this.props.newEquipment,
            this.props.ownedPerks,
            this.props.perksByID,
            this.props.quests
          );

          return (
            <div
              className={`${ChampionContainer} ${selectedClassName}`}
              onClick={this.onChampionClick.bind(this, champion)}
              onMouseEnter={this.onMouseEnter.bind(this)}
            >
              <img className={Image} src={thumbnailURL} />
              {this.props.profile.defaultChampionID === champion.id ? (
                <span className={`${StarIcon} fs-icon-misc-star`} />
              ) : null}
              {isBadgedEV.value && <StarBadge className={Badge} />}
            </div>
          );
        })}
      </div>
    );
  }

  private onChampionClick(champion: ChampionInfo) {
    this.props.dispatch(updateSelectedChampion(champion));
    if (champion.championSelectSound) {
      game.playGameSound(champion.championSelectSound);
    } else {
      game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
    }
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private getEquippedCostumeForChampion(champion: ChampionInfo): ChampionCostumeInfo {
    const championGQL = this.props.profile.champions.find((c) => {
      return c.championID === champion.id;
    });
    const allCostumesForChampion: ChampionCostumeInfo[] = this.props.championCostumes.filter(
      (costume: ChampionCostumeInfo) => {
        return costume.requiredChampionID === champion.id;
      }
    );

    const costumePerk = this.props.perksByID[championGQL?.costumePerkID];

    const equippedCostume = allCostumesForChampion.find((costume) => {
      return costume.id === costumePerk?.costume?.id;
    });

    return equippedCostume;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { ownedPerks, quests } = state.profile;
  const { selectedChampion, champions, championCostumes } = state.championInfo;
  const { perksByID, newEquipment } = state.store;

  return {
    ...ownProps,
    champions,
    selectedChampion,
    profile: state.profile,
    championCostumes: championCostumes || [],
    perksByID,
    ownedPerks,
    newEquipment,
    quests
  };
}

export const ChampionSelect = connect(mapStateToProps)(AChampionSelect);

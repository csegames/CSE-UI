/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ChampionInfo, Match, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Round } from '../../../mainScreen/redux/matchSlice';

const Champions = 'LoadingScreen-Champions';
const ChampionsCentered = 'LoadingScreen-ChampionsCentered';
const Champion = 'LoadingScreen-Champion';
const ChampionPortrait = 'LoadingScreen-ChampionPortrait';
const ChampionPortraitImage = 'LoadingScreen-ChampionPortraitImage';
const ChampionPortraitShadow = 'LoadingScreen-ChampionPortraitShadow';
const ChampionPortraitName = 'LoadingScreen-ChampionPortraitName';
const ChampionName = 'LoadingScreen-ChampionName';

interface InjectedProps {
  currentRound: Round;
  championIDToChampion: Dictionary<ChampionInfo>;
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

interface ReactProps {}

class AChampionCards extends React.Component<Props> {
  public render(): JSX.Element {
    const rosters = (this.props.currentRound as Match)?.rosters ?? [];
    const roster = rosters.find((roster) => roster.teamID === 'Players');
    if (!roster) return null;
    const cappedMembers = roster.members.slice(0, 8);
    return (
      <div className={cappedMembers.length <= 4 ? `${Champions} ${ChampionsCentered}` : Champions}>
        {cappedMembers.map((member) => {
          const image = this.props.perksByID[member.champion?.portraitID]?.iconURL;
          const championName = this.props.championIDToChampion[member.champion?.championID]?.name;
          return (
            <div className={Champion} key={member.id}>
              <div className={ChampionPortrait}>
                <img className={ChampionPortraitImage} src={image} />
                <div className={ChampionPortraitShadow} />
                <div className={ChampionPortraitName}>{championName}</div>
              </div>
              <div className={ChampionName}>{member.displayName}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRound } = state.match;
  const { championIDToChampion } = state.championInfo;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    currentRound,
    championIDToChampion,
    perksByID
  };
}

export const ChampionCards = connect(mapStateToProps)(AChampionCards);

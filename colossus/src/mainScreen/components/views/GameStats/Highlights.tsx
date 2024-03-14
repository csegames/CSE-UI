/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  OvermindCharacterSummaryGQL,
  OvermindSummaryGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { Dictionary } from '@reduxjs/toolkit';

const Container = 'GameStats-Highlights-Container';
const HighlightContainer = 'GameStats-Highlights-HighlightContainer';
const ChampionImage = 'GameStats-Highlights-ChampionImage';
const BGOverlay = 'GameStats-Highlights-BGOverlay';
const PlayerInfoContainer = 'GameStats-Highlights-PlayerInfoContainer';
const PlayerName = 'GameStats-Highlights-PlayerName';
const ChampionName = 'GameStats-Highlights-ChampionName';
const StatContainer = 'GameStats-Highlights-StatContainer';
const StatNumber = 'GameStats-Highlights-StatNumber';

const StatName = 'GameStats-Highlights-StatName';

const StringIDGameStatsKills = 'GameStatsKills';
const StringIDGameStatsTotalDamage = 'GameStatsTotalDamage';
const StringIDGameStatsDamageTaken = 'GameStatsDamageTaken';
const StringIDGameStatsKillStreak = 'GameStatsKillStreak';
const StringIDGameStatsLongestLife = 'GameStatsLongestLife';
const StringIDGameStatsAllyRevives = 'GameStatsAllyRevives';

interface ReactProps {
  overmindSummary: OvermindSummaryGQL;
}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export interface HighlightStat {
  userName: string;
  championName: string;
  costumeURL: string;
  statNumber: number;
  statStringID: string;
}

interface PlayerDifference {
  player: OvermindCharacterSummaryGQL;
  statNumber: number;
  statStringID: string;
  difference: number;
}

class AHighlights extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const highlightPlayers = this.getHighlightPlayers();
    return (
      <div className={Container}>
        {this.renderHighlight(highlightPlayers[0], 'card1')}
        {this.renderHighlight(highlightPlayers[1], 'card2')}
        {this.renderHighlight(highlightPlayers[2], 'card3')}
        {this.renderHighlight(highlightPlayers[3], 'card4')}
      </div>
    );
  }

  private getHighlightPlayers(): HighlightStat[] {
    let totalKills = 0;
    let totalDamage = 0;
    let totalDamageTaken = 0;

    let bestKills = 0;
    let bestKillsPlayer: OvermindCharacterSummaryGQL = null;

    let bestKillStreak = 0;
    let bestKillStreakPlayer: OvermindCharacterSummaryGQL = null;

    let bestLongestLife = 0;
    let bestLongestLifePlayer: OvermindCharacterSummaryGQL = null;

    let bestAllyRevives = 0;
    let bestAllyRevivesPlayer: OvermindCharacterSummaryGQL = null;

    let bestDamage = 0;
    let bestDamagePlayer: OvermindCharacterSummaryGQL = null;

    let bestDamageTaken = 0;
    let bestDamageTakenPlayer: OvermindCharacterSummaryGQL = null;

    let secondBestKills = 0;
    let secondBestDamage = 0;
    let secondBestDamageTaken = 0;
    let secondBestKillStreak = 0;
    let secondLongestLife = 0;
    let secondBestAllyRevives = 0;

    this.props.overmindSummary.characterSummaries.forEach((player) => {
      totalKills += player.kills;
      totalDamage += player.damageApplied;
      totalDamageTaken += player.damageTaken;

      if (player.kills >= bestKills) {
        secondBestKills = bestKills;
        bestKills = player.kills;
        bestKillsPlayer = player;
      }

      if (player.damageApplied >= bestDamage) {
        secondBestDamage = bestDamage;
        bestDamage = player.damageApplied;
        bestDamagePlayer = player;
      }

      if (player.damageTaken >= bestDamageTaken) {
        secondBestDamageTaken = bestDamageTaken;
        bestDamageTaken = player.damageTaken;
        bestDamageTakenPlayer = player;
      }

      if (player.longestKillStreak >= bestKillStreak) {
        secondBestKillStreak = bestKillStreak;
        bestKillStreak = player.longestKillStreak;
        bestKillStreakPlayer = player;
      }

      if (player.longestLife >= bestLongestLife) {
        secondLongestLife = bestLongestLife;
        bestLongestLife = player.longestLife;
        bestLongestLifePlayer = player;
      }

      if (player.reviveAssistCount >= bestAllyRevives) {
        secondBestAllyRevives = bestAllyRevives;
        bestAllyRevives = player.reviveAssistCount;
        bestAllyRevivesPlayer = player;
      }
    });

    // Run through a second time to ensure we actually got second best
    if (
      !secondBestKills ||
      !secondBestDamage ||
      !secondBestDamageTaken ||
      !secondBestKillStreak ||
      !secondLongestLife ||
      !secondBestAllyRevives
    ) {
      this.props.overmindSummary.characterSummaries.forEach((player) => {
        if (player.kills < bestKills && player.kills > secondBestKills) {
          secondBestKills = player.kills;
        }

        if (player.longestKillStreak < bestKillStreak && player.longestKillStreak > secondBestKillStreak) {
          secondBestKillStreak = player.longestKillStreak;
        }

        if (player.damageApplied < bestDamage && player.damageApplied > secondBestDamage) {
          secondBestDamage = player.damageApplied;
        }

        if (player.damageTaken < bestDamageTaken && player.damageTaken > secondBestDamageTaken) {
          secondBestDamageTaken = player.damageTaken;
        }

        if (player.longestLife < bestLongestLife && player.longestLife > secondLongestLife) {
          secondLongestLife = player.longestLife;
        }

        if (player.reviveAssistCount < bestAllyRevives && player.reviveAssistCount > secondBestAllyRevives) {
          secondBestAllyRevives = player.reviveAssistCount;
        }
      });
    }

    // Get percentage differences
    const killDifference: PlayerDifference = {
      player: bestKillsPlayer,
      statStringID: StringIDGameStatsKills,
      statNumber: bestKillsPlayer.kills,
      difference: bestKills / totalKills - secondBestKills / totalKills
    };
    const damageDifference: PlayerDifference = {
      player: bestDamagePlayer,
      statStringID: StringIDGameStatsTotalDamage,
      statNumber: bestDamagePlayer.damageApplied,
      difference: bestDamage / totalDamage - secondBestDamage / totalDamage
    };
    const damageTakenDifference: PlayerDifference = {
      player: bestDamageTakenPlayer,
      statStringID: StringIDGameStatsDamageTaken,
      statNumber: bestDamageTakenPlayer.damageTaken,
      difference: bestDamageTaken / totalDamageTaken - secondBestDamageTaken / totalDamageTaken
    };
    const killStreakDifference: PlayerDifference = {
      player: bestKillStreakPlayer,
      statStringID: StringIDGameStatsKillStreak,
      statNumber: bestKillStreakPlayer.longestKillStreak,
      difference: 1 - secondBestKillStreak / bestKillStreak
    };
    const longestLifeDifference: PlayerDifference = {
      player: bestLongestLifePlayer,
      statStringID: StringIDGameStatsLongestLife,
      statNumber: bestLongestLifePlayer.longestLife,
      difference: 1 - secondLongestLife / bestLongestLife
    };
    const allyRevivesDifference: PlayerDifference = {
      player: bestAllyRevivesPlayer,
      statStringID: StringIDGameStatsAllyRevives,
      statNumber: bestAllyRevivesPlayer.reviveAssistCount,
      difference: 1 - secondBestAllyRevives / bestAllyRevives
    };

    const sortedHighlightStats: HighlightStat[] = [
      killDifference,
      damageDifference,
      damageTakenDifference,
      killStreakDifference,
      longestLifeDifference,
      allyRevivesDifference
    ]
      .sort((a, b) => b.difference - a.difference)
      .map((p) => {
        const champion = this.props.champions.find((champion) => champion.id === p.player.classID);
        const costume = this.props.championCostumes.find((costume) => costume.id === p.player.raceID);
        return {
          userName: p.player.userName,
          championName: champion ? champion.name : '',
          costumeURL: costume ? costume.cardImageURL : '',
          statStringID: p.statStringID,
          statNumber: p.statNumber
        };
      });

    return sortedHighlightStats;
  }

  private renderHighlight(p: HighlightStat, className: string): JSX.Element {
    return (
      <div className={`${HighlightContainer} ${className}`}>
        <img className={ChampionImage} src={p.costumeURL} />
        <div className={BGOverlay} />
        <div className={PlayerInfoContainer}>
          <div className={PlayerName}>{p.userName}</div>
          <div className={ChampionName}>{p.championName}</div>
        </div>
        <div className={StatContainer}>
          <div className={StatNumber}>
            {p.statStringID === StringIDGameStatsLongestLife
              ? formatDuration(p.statNumber)
              : printWithSeparator(Math.round(p.statNumber), ',')}
          </div>
          <div className={StatName}>{getStringTableValue(p.statStringID, this.props.stringTable)}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { championCostumes, champions } = state.championInfo;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    championCostumes,
    champions,
    stringTable
  };
}

export const Highlights = connect(mapStateToProps)(AHighlights);

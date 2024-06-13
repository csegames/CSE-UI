/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { ResourceBar } from '../../shared/ResourceBar';
import { ThumbsUpButton } from './ThumbsUpButton';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import {
  ChampionCostumeInfo,
  ChampionInfo as ChampionInfoData,
  OvermindCharacter,
  OvermindSummaryGQL,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { QuestsByType } from '../../../redux/questSlice';
import { AccountID } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { Dispatch } from '@reduxjs/toolkit';

const Container = 'GameStats-StatsListItem-Container';
const Level = 'GameStats-StatsListItem-Level';
const ChampionProfile = 'GameStats-StatsListItem-ChampionProfile';
const ChampionInfo = 'GameStats-StatsListItem-ChampionInfo';
const PlayerName = 'GameStats-StatsListItem-PlayerName';
const ChampionName = 'GameStats-StatsListItem-ChampionName';
const Section = 'GameStats-StatsListItem-Section';
const SectionPlayerScore = 'GameStats-StatsListItem-SectionPlayerScore';
const PlayerScore = 'GameStats-StatsListItem-PlayerScore';

const BarStyles = 'GameStats-StatsListItem-BarStyles';

const StringIDGameStatsChampionName = 'GameStatsChampionName';

interface StatPercentages {
  kills: number;
  killStreak: number;
  longestLife: number;
  allyRevives: number;
  totalDamage: number;
  damageTaken: number;
}

interface ReactProps {
  playerStat: OvermindCharacter;
}

interface InjectedProps {
  overmindSummary: OvermindSummaryGQL;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfoData[];
  perksByID: Dictionary<PerkDefGQL>;
  quests: QuestsByType;
  accountID: AccountID;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AStatsListItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const statsCurrentPercentage = this.getStatsCurrentPercentage();
    const championInfo = this.getChampionInfo();
    const thumbnailURL = this.getChampionThumbnailURL();
    const championName = championInfo
      ? championInfo.name
      : getStringTableValue(StringIDGameStatsChampionName, this.props.stringTable);
    const championQuest = this.props.quests.Champion.find((q) => q.id == this.props.playerStat.classID);
    const maxChampionLevel = championQuest?.links.length ?? 1;
    const maxLevel = this.props.playerStat.level < maxChampionLevel ? '' : 'MaxLevel';
    const playerLevel = Math.min(maxChampionLevel, this.props.playerStat.level);

    return (
      <div className={Container}>
        <span className={`${Level} ${maxLevel}`}>{`${playerLevel}`}</span>
        <img className={ChampionProfile} src={thumbnailURL} />
        <div className={ChampionInfo}>
          <div className={PlayerName}>{this.props.playerStat.userName}</div>
          <div className={ChampionName}>{championName}</div>
        </div>

        <div className={SectionPlayerScore}>
          <div className={PlayerScore}>{this.renderScore()}</div>
          <div className={ChampionName}>&nbsp;</div>
          {/* spacer so that the score text lines up vertically with the username text */}
        </div>
        <div className={Section}>
          {this.renderBar(printWithSeparator(this.props.playerStat.kills, ','), statsCurrentPercentage.kills)}
        </div>
        <div className={Section}>
          {this.renderBar(
            printWithSeparator(this.props.playerStat.longestKillStreak, ','),
            statsCurrentPercentage.killStreak
          )}
        </div>
        <div className={Section}>
          {this.renderBar(formatDuration(this.props.playerStat.longestLife), statsCurrentPercentage.longestLife)}
        </div>
        <div className={Section}>
          {this.renderBar(
            printWithSeparator(this.props.playerStat.reviveAssistCount, ','),
            statsCurrentPercentage.allyRevives
          )}
        </div>
        <div className={Section}>
          {this.renderBar(
            printWithSeparator(Math.round(this.props.playerStat.damageApplied), ','),
            statsCurrentPercentage.totalDamage
          )}
        </div>
        <div className={Section}>
          {this.renderBar(
            printWithSeparator(Math.round(this.props.playerStat.damageTaken), ','),
            statsCurrentPercentage.damageTaken
          )}
        </div>
        <div>
          <ThumbsUpButton
            accountID={this.props.playerStat.accountID}
            onSameTeam={this.onSameTeam(this.props.playerStat)}
          />
        </div>
      </div>
    );
  }

  private onSameTeam(playerSummary: OvermindCharacter): boolean {
    const selfTeamID = this.props.overmindSummary.characterSummaries.find(
      (c) => c.accountID == this.props.accountID
    )?.teamID;

    return selfTeamID == playerSummary.teamID;
  }

  private getChampionThumbnailURL(): string {
    const portraitID = this.props.playerStat.portraitPerkID;
    const portraitPerk = this.props.perksByID[portraitID ?? ''];
    if (portraitPerk) {
      return portraitPerk.portraitThumbnailURL;
    }

    const championInfo = this.getChampionInfo();
    return championInfo && championInfo.costume
      ? championInfo.costume.thumbnailURL
      : 'images/hud/champions/berserker-profile.png';
  }

  private getStatsCurrentPercentage(): StatPercentages {
    let bestKills = 0;
    let bestKillStreak = 0;
    let bestLongestLife = 0;
    let bestAllyRevives = 0;
    let bestDamage = 0;
    let bestDamageTaken = 0;

    this.props.overmindSummary.characterSummaries.forEach((player) => {
      if (player.kills > bestKills) {
        bestKills = player.kills;
      }

      if (player.damageApplied > bestDamage) {
        bestDamage = player.damageApplied;
      }

      if (player.damageTaken > bestDamageTaken) {
        bestDamageTaken = player.damageTaken;
      }

      if (player.longestKillStreak > bestKillStreak) {
        bestKillStreak = player.longestKillStreak;
      }

      if (player.longestLife > bestLongestLife) {
        bestLongestLife = player.longestLife;
      }

      if (player.reviveAssistCount > bestAllyRevives) {
        bestAllyRevives = player.reviveAssistCount;
      }
    });

    return {
      kills: (this.props.playerStat.kills / bestKills) * 100,
      killStreak: (this.props.playerStat.longestKillStreak / bestKillStreak) * 100,
      longestLife: (this.props.playerStat.longestLife / bestLongestLife) * 100,
      allyRevives: (this.props.playerStat.reviveAssistCount / bestAllyRevives) * 100,
      totalDamage: (this.props.playerStat.damageApplied / bestDamage) * 100,
      damageTaken: (this.props.playerStat.damageTaken / bestDamageTaken) * 100
    };
  }

  private renderBar(numberText: string, current: number): JSX.Element {
    const isSelf = this.props.playerStat.accountID == this.props.accountID;
    return (
      <ResourceBar
        isSquare
        type='blue'
        current={current}
        max={100}
        text={numberText}
        containerClasses={`${BarStyles} ${isSelf ? 'self' : ''}`}
      />
    );
  }

  private renderScore(): JSX.Element {
    const numberText = printWithSeparator(Math.round(this.props.playerStat.score), ',');
    return <div className={PlayerScore}>{numberText}</div>;
  }

  private getChampionInfo() {
    const playerChampion = this.props.champions.find((champion) => champion.id === this.props.playerStat.classID);
    const playerCostume = this.props.championCostumes.find((costume) => costume.id === this.props.playerStat.raceID);
    return {
      ...playerChampion,
      costume: playerCostume
    };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { overmindSummary } = state.gameStats;
  const { championCostumes, champions } = state.championInfo;
  const { perksByID } = state.store;
  const questsByType = state.quests.quests;
  const accountID = state.user.id;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    overmindSummary,
    championCostumes,
    champions,
    perksByID,
    quests: questsByType,
    accountID,
    stringTable
  };
}

export const StatsListItem = connect(mapStateToProps)(AStatsListItem);

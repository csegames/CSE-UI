/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Title } from '../Title';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  MatchStatsGQL,
  ChampionGQL,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { ProfileModel } from '../../../../redux/profileSlice';
import { Dispatch } from 'redux';
import { getWornCostumeForChampion } from '../../../../../mainScreen/helpers/characterHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { refreshProfile } from '../../../../dataSources/profileNetworking';

const Container = 'CareerStats-Container';
const NoDataText = 'CareerStats-NoDataText';
const LeftSection = 'CareerStats-LeftSection';
const StatBlockContainer = 'CareerStats-StatBlockContainer';
const StatBlockAnimation = 'CareerStats-StatBlockAnimation';
const TopStatBlockSpacing = 'CareerStats-TopStatBlockSpacing';
const TitleStyles = 'CareerStats-TitleStyles';
const StatHeaderBlock = 'CareerStats-StatHeaderBlock';
const PlayerName = 'CareerStats-PlayerName';
const CareerStat = 'CareerStats-CareerStat';
const StatName = 'CareerStats-StatName';
const StatValue = 'CareerStats-StatValue';
const ThumbsUp = 'CareerStats-ThumbsUp';

const StatBlock = 'CareerStats-StatBlock';

function statBlockStyles(img: string) {
  return { backgroundImage: `url(${img})` };
}

const Shadow = 'CareerStats-Shadow';

const TopContainer = 'CareerStats-TopContainer';

const TitleText = 'CareerStats-TitleText';

const HighlightText = 'CareerStats-HighlightText';

const SecondaryInfo = 'CareerStats-SecondaryInfo';

const SecondaryStatText = 'CareerStats-SecondaryStatText';

const StringIDCareerStatsBestScore = 'CareerStatsBestScore';
const StringIDCareerStatsBestScenarioScore = 'CareerStatsBestScenarioScore';
const StringIDCareerStatsEarnedTitle = 'CareerStatsEarnedTitle';
const StringIDCareerStatsTitle = 'CareerStatsTitle';
const StringIDCareerStatsMostPlayed = 'CareerStatsMostPlayed';
const StringIDCareerStatsAllChampions = 'CareerStatsAllChampions';
const StringIDCareerStatsStatNotAvailable = 'CareerStatsStatNotAvailable';
const StringIDCareerStatsTotal = 'CareerStatsTotal';
const StringIDCareerStatsMostKills = 'CareerStatsMostKills';
const StringIDCareerStatsAverage = 'CareerStatsAverage';
const StringIDCareerStatsBestKillStreak = 'CareerStatsBestKillStreak';
const StringIDCareerStatsLongestLife = 'CareerStatsLongestLife';
const StringIDCareerStatsMostDamageTaken = 'CareerStatsMostDamageTaken';
const StringIDCareerStatsMostDamageDone = 'CareerStatsMostDamageDone';
const StringIDCareerStatsNoStats = 'CareerStatsNoStats';

interface ReactProps {}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  championIDToChampion: { [championID: string]: ChampionInfo };
  displayName: string;
  allTimeStats: MatchStatsGQL;
  profile: ProfileModel;
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ACareerStats extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const compiledData = this.getData();
    const displayName = this.props.displayName ? <div className={PlayerName}>{this.props.displayName}</div> : null;
    return this.props.allTimeStats && compiledData ? (
      <div className={Container}>
        <div className={LeftSection}>
          <div className={StatHeaderBlock}>
            {displayName}
            <div className={CareerStat}>
              <div className={StatName}>
                {getStringTableValue(StringIDCareerStatsBestScore, this.props.stringTable)}
              </div>
              <div className={StatValue}>{printWithSeparator(Math.round(this.props.allTimeStats.maxScore), ',')}</div>
            </div>
            <div className={CareerStat}>
              <div className={StatName}>
                {getStringTableValue(StringIDCareerStatsBestScenarioScore, this.props.stringTable)}
              </div>
              <div className={StatValue}>
                {printWithSeparator(Math.round(this.props.allTimeStats.maxScenarioScore), ',')}
              </div>
            </div>
            <div className={CareerStat}>
              <div className={StatName}>
                {getStringTableValue(StringIDCareerStatsEarnedTitle, this.props.stringTable)}
              </div>
              <div className={StatValue}>
                {this.props.allTimeStats.thumbsUp} <span className={`${ThumbsUp} icon-thumbsup`} />
              </div>
            </div>
          </div>
          <div className={`${Title} ${TitleStyles}`}>
            {getStringTableValue(StringIDCareerStatsTitle, this.props.stringTable)}
          </div>
          <div className={StatBlockContainer}>
            <div
              className={`${StatBlock} ${TopStatBlockSpacing} ${StatBlockAnimation} stat1`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.mostPlayedChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsMostPlayed, this.props.stringTable)}
                </div>
                <div className={HighlightText}>
                  {compiledData.mostPlayedChampion
                    ? compiledData.mostPlayedChampion.name
                    : getStringTableValue(StringIDCareerStatsStatNotAvailable, this.props.stringTable)}
                </div>
              </div>

              <div className={SecondaryInfo}>
                <div className={SecondaryStatText}>
                  {getStringTableValue(StringIDCareerStatsAllChampions, this.props.stringTable)}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsTotal, this.props.stringTable, {
                    TOTAL: formatDuration(this.props.allTimeStats.totalPlayTime)
                  })}
                </div>
              </div>
            </div>
            <div
              className={`${StatBlock} ${TopStatBlockSpacing} ${StatBlockAnimation} stat2`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.bestKillsChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsMostKills, this.props.stringTable)}
                </div>
                <div className={HighlightText}>
                  {printWithSeparator(Math.round(this.props.allTimeStats.mostKillsInMatch), ',')}
                </div>
              </div>

              <div className={SecondaryInfo}>
                <div className={SecondaryStatText}>
                  {getStringTableValue(StringIDCareerStatsAllChampions, this.props.stringTable)}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsTotal, this.props.stringTable, {
                    TOTAL: printWithSeparator(this.props.allTimeStats.kills, ',')
                  })}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsAverage, this.props.stringTable, {
                    AVERAGE: printWithSeparator(
                      Math.round(this.props.allTimeStats.kills / this.props.allTimeStats.matchesPlayed),
                      ','
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              className={`${StatBlock} ${TopStatBlockSpacing} ${StatBlockAnimation} stat3`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.bestKillsChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsBestKillStreak, this.props.stringTable)}
                </div>
                <div className={HighlightText}>{printWithSeparator(Math.round(compiledData.bestKillStreak), ',')}</div>
              </div>
            </div>
            <div
              className={`${StatBlock} ${StatBlockAnimation} stat4`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.bestLongestLifeChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsLongestLife, this.props.stringTable)}
                </div>
                <div className={HighlightText}>{formatDuration(compiledData.bestLongestLife)}</div>
              </div>
            </div>
            <div
              className={`${StatBlock} ${StatBlockAnimation} stat5`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.bestDamageTakenChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsMostDamageTaken, this.props.stringTable)}
                </div>
                <div className={HighlightText}>
                  {printWithSeparator(Math.round(this.props.allTimeStats.mostDamageTakenInMatch), ',')}
                </div>
              </div>

              <div className={SecondaryInfo}>
                <div className={SecondaryStatText}>
                  {getStringTableValue(StringIDCareerStatsAllChampions, this.props.stringTable)}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsTotal, this.props.stringTable, {
                    TOTAL: printWithSeparator(Math.round(this.props.allTimeStats.damageTaken), ',')
                  })}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsAverage, this.props.stringTable, {
                    AVERAGE: printWithSeparator(
                      Math.round(this.props.allTimeStats.damageTaken / this.props.allTimeStats.matchesPlayed),
                      ','
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              className={`${StatBlock} ${StatBlockAnimation} stat6`}
              style={statBlockStyles(this.getChampionCardImage(compiledData.bestDamageChampion))}
            >
              <div className={Shadow} />
              <div className={TopContainer}>
                <div className={TitleText}>
                  {getStringTableValue(StringIDCareerStatsMostDamageDone, this.props.stringTable)}
                </div>
                <div className={HighlightText}>{printWithSeparator(Math.round(compiledData.bestDamage), ',')}</div>
              </div>

              <div className={SecondaryInfo}>
                <div className={SecondaryStatText}>
                  {getStringTableValue(StringIDCareerStatsAllChampions, this.props.stringTable)}
                </div>
                <div className={SecondaryStatText}>
                  Total: {printWithSeparator(Math.round(this.props.allTimeStats.damageApplied), ',')}
                </div>
                <div className={SecondaryStatText}>
                  {getTokenizedStringTableValue(StringIDCareerStatsAverage, this.props.stringTable, {
                    AVERAGE: printWithSeparator(
                      Math.round(this.props.allTimeStats.damageApplied / this.props.allTimeStats.matchesPlayed),
                      ','
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={NoDataText}>{getStringTableValue(StringIDCareerStatsNoStats, this.props.stringTable)}</div>
    );
  }

  componentDidMount() {
    if (this.props.profile) {
      refreshProfile();
    }
  }

  private getData() {
    if (!this.props.profile || !this.props.profile.champions) {
      return;
    }

    let mostTotalTimePlayed = 0;
    let mostPlayedChampion: ChampionInfo = null;
    let bestKills = 0;
    let bestKillsChampion: ChampionInfo = null;
    let bestKillStreak = 0;
    let bestKillStreakChampion: ChampionInfo = null;
    let bestLongestLife = 0;
    let bestLongestLifeChampion: ChampionInfo = null;
    let bestDamageTaken = 0;
    let bestDamageTakenChampion: ChampionInfo = null;
    let bestDamage = 0;
    let bestDamageChampion: ChampionInfo = null;

    this.props.profile.champions.forEach((champ) => {
      const championInfo = this.props.championIDToChampion[champ.championID];

      if (!championInfo) {
        console.error('Seeing champion stats from Colossus Profile for a non-colossus champion: ' + champ.championID);
        return;
      }

      // this champ doesn't have any stats at this time
      if (champ.stats == null) {
        return;
      }

      let championTotalTimePlayed = 0;
      champ.stats.forEach((matchStats: MatchStatsGQL) => {
        // Increment total time played for champion
        championTotalTimePlayed += matchStats.totalPlayTime;

        // Find best stats
        if (bestKills < matchStats.kills) {
          bestKills = matchStats.kills;
          bestKillsChampion = championInfo;
        }

        if (bestKillStreak < matchStats.longestKillStreak) {
          bestKillStreak = matchStats.longestKillStreak;
          bestKillStreakChampion = championInfo;
        }

        if (bestLongestLife < matchStats.longestLife) {
          bestLongestLife = matchStats.longestLife;
          bestLongestLifeChampion = championInfo;
        }

        if (bestDamageTaken < matchStats.damageTaken) {
          bestDamageTaken = matchStats.damageTaken;
          bestDamageTakenChampion = championInfo;
        }

        if (bestDamage < matchStats.mostDamageAppliedInMatch) {
          bestDamage = matchStats.mostDamageAppliedInMatch;
          bestDamageChampion = championInfo;
        }
      });

      if (mostTotalTimePlayed < championTotalTimePlayed) {
        mostTotalTimePlayed = championTotalTimePlayed;
        mostPlayedChampion = championInfo;
      }
    });

    return {
      mostTotalTimePlayed,
      mostPlayedChampion,
      bestKills,
      bestKillsChampion,
      bestKillStreak,
      bestKillStreakChampion,
      bestLongestLife,
      bestLongestLifeChampion,
      bestDamageTaken,
      bestDamageTakenChampion,
      bestDamage,
      bestDamageChampion
    };
  }

  private getChampionCardImage(championInfo: ChampionInfo) {
    if (championInfo) {
      const costume: ChampionCostumeInfo = getWornCostumeForChampion(
        this.props.championCostumes,
        this.props.champions,
        this.props.perksByID,
        championInfo.id
      );
      if (costume) {
        return costume.cardImageURL;
      }
    }

    return '';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { championCostumes, championIDToChampion } = state.championInfo;
  const { displayName } = state.user;
  const { champions, allTimeStats } = state.profile;
  const { perksByID } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    championCostumes,
    championIDToChampion,
    displayName,
    allTimeStats,
    profile: state.profile,
    perksByID,
    champions,
    stringTable
  };
}

export const CareerStats = connect(mapStateToProps)(ACareerStats);

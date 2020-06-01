/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useEffect } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';

import { Title } from '../../Title';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { formatHourTime } from '../../../../lib/timeHelpers';

const Container = styled.div`
  display: flex;
  width: 80%;
  height: 90%;
  padding: 20px 10% 0 10%;
`;

const NoDataText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 90%;
  padding: 20px 10% 0 10%;
  font-size: 40px;
  font-family: Colus;
  color: white;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
`;

const StatBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

const StatBlockAnimation = css`
  animation: popIn 0.7s forwards;
  bottom: -10%;
  opacity: 0;
  transform: scale(1);

  &.stat1 {
    animation-delay: 0.1s;
  }

  &.stat2 {
    animation-delay: 0.2s;
  }

  &.stat3 {
    animation-delay: 0.3s;
  }

  &.stat4 {
    animation-delay: 0.4s;
  }

  &.stat5 {
    animation-delay: 0.5s;
  }

  &.stat6 {
    animation-delay: 0.6s;
  }


  @keyframes popIn {
    0% {
      opacity: 0;
      bottom: -10%;
      transform:scale(1);
    }
    70%{
      transform:scale(1);
      bottom: 0;
    }
    100% {
      opacity: 1;
      bottom: 0;
      transform:scale(1);
    }
  }
`;

// const ListContainer = styled.div`
//   flex: 1;
// `;

const TopStatBlockSpacing = css`
  margin-top: 20px;
`;

const TitleStyles = css`
  display: flex;
  justify-content: space-between;
  opacity: 0;
  margin-top: -5%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-top: -5%;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const ThumbsupContainer = styled.div`
  margin-right: 20px;
  left: -5%;
  opacity: 0;
  animation: slideIn 0.3s forwards ;
  animation-delay:0.3s;
  @keyframes slideIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ThumbsUp = styled.span`
  margin-right: 5px;
`;

const StatBlock = styled.div`
  position: relative;
  flex: 1;
  min-width: calc(33% - 20px);
  margin: 20px 20px 0 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 0;
  outline: 1px solid rgba(255, 183, 211, 0.3);
  outline-offset: -15px;
  background-image: ${(props: { image: string } & React.HTMLProps<HTMLDivElement>) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  transition: filter 0.3s ;
  &:hover{
    filter: brightness(1.5);
  }
`;

const Shadow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to left, rgba(50, 30, 49, 0.9), transparent, rgba(13, 33, 50, 0.9)), linear-gradient(rgba(50, 10, 29, 0.9) 6.3%, transparent, rgba(21, 27, 50, 0.9) 90%);
  z-index: -1;
`;

const TopContainer = styled.div`
  text-align: center;
  line-height: 32px;
`;

const TitleText = styled.div`
  font-family: Colus;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 20px;
`;

const HighlightText = styled.div`
  font-family: Colus;
  font-size: 40px;
  color: white;
  text-overflow: ellipsis;
`;

const SecondaryInfo = styled.div`
  text-align: center;
  justify-self: flex-end;
  margin-bottom: 30px;
`;

const SecondaryStatText = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
`;

export interface Props {
}

export function CareerStats(props: Props) {
  const { colossusProfile, allTimeStats, graphql } = useContext(ColossusProfileContext);
  const { championIDToChampion, championCostumes } = useContext(ChampionInfoContext);

  useEffect(() => {
    if (graphql) {
      graphql.refetch();
    }
  }, []);

  function getData() {
    if (!colossusProfile || !colossusProfile.champions) return;

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
    let totalMatches = 0;

    colossusProfile.champions.forEach((champ) => {
      const championInfo = championIDToChampion[champ.championID];

      if (!championInfo) {
        console.error('Seeing champion stats from Colossus Profile for a non-colossus champion: ' + champ.championID);
        return;
      }

      let championTotalTimePlayed = 0;
      champ.stats.forEach((matchStats) => {
        // Increment total matches
        totalMatches++;

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

        if (bestDamage < matchStats.damageApplied) {
          bestDamage = matchStats.damageApplied;
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
      bestDamageChampion,
      totalMatches,
    };
  }

  function getChampionCardImage(champion: ChampionInfo) {
    const firstCostume = championCostumes.find(costume => costume.requiredChampionID === champion.id);
    if (!firstCostume) {
      return '';
    }

    return firstCostume.cardImageURL;
  }

  const compiledData = getData();
  return allTimeStats && compiledData ? (
    <Container>
      <LeftSection>
        <Title className={TitleStyles}>
          Career Stats

          <ThumbsupContainer>
            You've earned {allTimeStats.thumbsUp} <ThumbsUp className='icon-thumbsup'></ThumbsUp>
          </ThumbsupContainer>
        </Title>
        <StatBlockContainer>
          <StatBlock
            className={`${TopStatBlockSpacing} ${StatBlockAnimation} stat1`}
            image={getChampionCardImage(compiledData.mostPlayedChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Most Played</TitleText>
              <HighlightText>
                {compiledData.mostPlayedChampion ? compiledData.mostPlayedChampion.name : 'N/A'}
              </HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>Total: {formatHourTime(allTimeStats.totalPlayTime)}</SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
          <StatBlock
            className={`${TopStatBlockSpacing} ${StatBlockAnimation} stat2`}
            image={getChampionCardImage(compiledData.bestKillsChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Most Kills</TitleText>
              <HighlightText>{Math.round(allTimeStats.mostKillsInMatch).printWithSeparator(',')}</HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>Total: {allTimeStats.kills.printWithSeparator(',')}</SecondaryStatText>
              <SecondaryStatText>
                Average: {Math.round(allTimeStats.kills / compiledData.totalMatches).printWithSeparator(',')}
              </SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
          <StatBlock
            className={`${TopStatBlockSpacing} ${StatBlockAnimation} stat3`}
            image={getChampionCardImage(compiledData.bestKillsChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Best Kill Streak</TitleText>
              <HighlightText>{Math.round(compiledData.bestKillStreak).printWithSeparator(',')}</HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>
                Average: {Math.round(allTimeStats.longestKillStreak / compiledData.totalMatches).printWithSeparator(',')}
              </SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
          <StatBlock
            className={`${StatBlockAnimation} stat4`}
            image={getChampionCardImage(compiledData.bestLongestLifeChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Longest Life</TitleText>
              <HighlightText>{formatHourTime(compiledData.bestLongestLife)}</HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>
                Average: {formatHourTime(Math.round(allTimeStats.longestLife / compiledData.totalMatches))}
              </SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
          <StatBlock
            className={`${StatBlockAnimation} stat5`}
            image={getChampionCardImage(compiledData.bestDamageTakenChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Most Damage Taken</TitleText>
              <HighlightText>{Math.round(allTimeStats.mostDamageTakenInMatch).printWithSeparator(',')}</HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>Total: {Math.round(allTimeStats.damageTaken).printWithSeparator(',')}</SecondaryStatText>
              <SecondaryStatText>
                Average: {Math.round(allTimeStats.damageTaken / compiledData.totalMatches).printWithSeparator(',')}
              </SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
          <StatBlock
            className={`${StatBlockAnimation} stat6`}
            image={getChampionCardImage(compiledData.bestDamageChampion)}>
            <Shadow />
            <TopContainer>
              <TitleText>Most Damage Done</TitleText>
              <HighlightText>{Math.round(compiledData.bestDamage).printWithSeparator(',')}</HighlightText>
            </TopContainer>

            <SecondaryInfo>
              <SecondaryStatText>(All Champions)</SecondaryStatText>
              <SecondaryStatText>
                Total: {Math.round(allTimeStats.mostDamageAppliedInMatch).printWithSeparator(',')}
              </SecondaryStatText>
              <SecondaryStatText>
                Average: {Math.round(allTimeStats.damageApplied / compiledData.totalMatches).printWithSeparator(',')}
              </SecondaryStatText>
            </SecondaryInfo>
          </StatBlock>
        </StatBlockContainer>
      </LeftSection>
      {/* <ListContainer>
        <List />
      </ListContainer> */}
    </Container>
  ) : <NoDataText>No career stats</NoDataText>;
}

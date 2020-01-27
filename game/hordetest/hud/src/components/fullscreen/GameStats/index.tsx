/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import * as webAPI from '@csegames/library/lib/hordetest/webAPI';
import {
  OvermindSummaryDBModel,
  OvermindSummaryAlert,
  ScenarioAlertCategory,
  IScenarioAlert,
} from '@csegames/library/lib/hordetest/graphql/schema';

import { StatsList } from './StatsList';
import { Highlights } from './Highlights';
import { Button } from '../Button';
import { InputContext } from 'components/context/InputContext';
import { formatTime } from 'lib/timeHelpers';

const query = gql`
  query GameStatsQuery($scenarioID: String!, $shardID: Int!) {
    overmindsummary(id: $scenarioID, shard: $shardID) {
      id
      shardID
      resolution
      startTime
      totalRunTime
      characterSummaries {
        characterID
        classID
        damageApplied
        damageTaken
        deathCount
        kills
        longestKillStreak
        longestLife
        raceID
        userName
        thumbsUpReward
      }
    }
  }
`;

const subscription = gql`
  subscription GameStatsSubscription($scenarioID: String!) {
    scenarioAlerts(scenarioID: $scenarioID) {
      targetID
      category
      when

      ... on OvermindSummaryAlert {
        summary {
          characterSummaries {
            characterID
            thumbsUpReward
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  padding: 25px;
  background-image: url(../images/fullscreen/gamestats/end-match-bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;

  opacity: 0;
  margin-left: -10%;
  animation: slideIn 0.3s forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-left: -10%;
    }
    to {
      opacity: 1;
      margin-left: 0;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 42px;
  font-family: Colus;
  color: white;
  margin-right: 20px;
`;

const MatchTitleInfo = styled.div`
  font-size: 17px;
  font-family: Lato;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
`;

const GameMode = styled.div`
  color: #505050;
`;

const MainSection = styled.div`
  display: flex;
  height: fit-content;
  width: 100%;
`;

const StatsListSection = styled.div`
  flex: 1;

  opacity: 0;
  margin-left: -10%;
  animation: slideIn 0.3s forwards;
  animation-delay: 0.2s;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-left: -10%;
    }
    to {
      opacity: 1;
      margin-left: 0;
    }
  }
`;

const HighlightsSection = styled.div`
  height: 100%;
  width: 700px;
`;

const ButtonStyle = css`
  display: flex;
  align-items: center;
  padding: 7px 20px;
  font-size: 20px;
`;

const ConsoleIcon = styled.span`
  margin-right: 5px;
`;

export interface Props {
  scenarioID: string;
  onLeaveClick: () => void;
}

export interface State {
  overmindSummary: OvermindSummaryDBModel;
  thumbsUp: { [characterID: string]: string[] };
}

export class GameStats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      overmindSummary: null,
      thumbsUp: {},
    };
  }

  public render() {
    const { overmindSummary } = this.state;
    return (
      <InputContext.Consumer>
        {({ isConsole }) => (
          <Container>
            <GraphQL
              query={{
                query,
                variables: {
                  scenarioID: this.props.scenarioID,
                  shardID: game.shardID,
                },
              }}
              subscription={{
                query: subscription,
                variables: {
                  scenarioID: this.props.scenarioID,
                },
              }}
              onQueryResult={this.handleQueryResult}
              subscriptionHandler={this.handleSubscriptionResult}
            />
            {overmindSummary &&
              <>
                <TopContainer>
                  <TitleContainer>
                    <Title>GAME STATS</Title>
                    <MatchTitleInfo>
                      <GameMode>Group Survival</GameMode>
                      <div>Match Time: {formatTime(overmindSummary.totalRunTime)}</div>
                    </MatchTitleInfo>
                  </TitleContainer>
                  {isConsole ?
                    <Button
                      type='blue'
                      text={<><ConsoleIcon className='icon-xb-b'></ConsoleIcon> Leave</>}
                      styles={ButtonStyle}
                    /> :
                    <Button
                      type='blue'
                      text='Leave'
                      onClick={this.props.onLeaveClick}
                      styles={ButtonStyle}
                    />
                  }
                </TopContainer>
                <MainSection>
                  <StatsListSection>
                    {overmindSummary.characterSummaries &&
                      <StatsList
                        overmindSummary={overmindSummary}
                        thumbsUp={this.state.thumbsUp}
                        onThumbsUpClick={this.onThumbsUpClick}
                        onRevokeClick={this.onRevokeClick}
                      />
                    }
                  </StatsListSection>
                  <HighlightsSection>
                    {overmindSummary.characterSummaries && <Highlights overmindSummary={overmindSummary} />}
                  </HighlightsSection>
                </MainSection>
              </>
            }
          </Container>
        )}
      </InputContext.Consumer>
    );
  }

  public componentWillUnmount() {
    game.playGameSound(SoundEvents.PLAY_SCENARIO_RESET);
  }

  private handleQueryResult = (gql: GraphQLResult<{ overmindsummary: OvermindSummaryDBModel }>) => {
    if (!gql || !gql.data || !gql.data.overmindsummary) return gql;

    const overmindSummary: OvermindSummaryDBModel = gql.data.overmindsummary;
    this.setState({ overmindSummary });
  }

  private handleSubscriptionResult = (result: SubscriptionResult<{ scenarioAlerts: IScenarioAlert }>, data: any) => {
    if (!result.data && !result.data.scenarioAlerts) return data;
    if (result.data.scenarioAlerts.category !== ScenarioAlertCategory.Summary) return data;

    const scenarioAlerts = result.data.scenarioAlerts as OvermindSummaryAlert;
    const thumbsUp = {};
    scenarioAlerts.summary.characterSummaries.forEach((summary) => {
      if (summary.thumbsUpReward === '0000000000000000000000') return;

      if (thumbsUp[summary.thumbsUpReward]) {
        thumbsUp[summary.thumbsUpReward].push(summary.characterID);
      } else {
        thumbsUp[summary.thumbsUpReward] = [summary.characterID];
      }
    });

    this.setState({ thumbsUp });
    return data;
  }

  private onThumbsUpClick = async (characterID: string) => {
    await webAPI.ScenarioAPI.RewardThumbsUp(webAPI.defaultConfig, this.props.scenarioID, characterID);

    const thumbsUp = cloneDeep(this.state.thumbsUp);
    if (thumbsUp[characterID]) {
      if (!thumbsUp[characterID].includes(game.characterID)) {
        thumbsUp[characterID].push(game.characterID);
      }
    } else {
      thumbsUp[characterID] = [game.characterID];
    }

    this.setState({ thumbsUp });
  }

  private onRevokeClick = async (characterID: string) => {
    await webAPI.ScenarioAPI.RevokeThumbsUp(webAPI.defaultConfig, this.props.scenarioID);

    const thumbsUp = cloneDeep(this.state.thumbsUp);
    thumbsUp[characterID] = thumbsUp[characterID].filter(id => id !== game.characterID);

    this.setState({ thumbsUp });
  }
}

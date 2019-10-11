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
import { OvermindSummaryDBModel } from '@csegames/library/lib/hordetest/graphql/schema';

import { StatsList } from './StatsList';
import { Highlights } from './Highlights';
import { Button } from '../Button';
import { InputContext } from 'components/context/InputContext';

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
      }
    }
  }
`;

const Container = styled.div`
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  padding: 25px;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
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
}

export class GameStats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      overmindSummary: null,
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
              onQueryResult={this.handleQueryResult}
            />
            {overmindSummary &&
              <>
                <TopContainer>
                  <TitleContainer>
                    <Title>GAME STATS</Title>
                    <MatchTitleInfo>
                      <GameMode>Group Survival</GameMode>
                      <div>Match Time: {overmindSummary.totalRunTime}</div>
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
                    <StatsList overmindSummary={overmindSummary} />
                  </StatsListSection>
                  <HighlightsSection>
                    <Highlights overmindSummary={overmindSummary} />
                  </HighlightsSection>
                </MainSection>
              </>
            }
          </Container>
        )}
      </InputContext.Consumer>
    );
  }

  private handleQueryResult = (gql: GraphQLResult<{ overmindsummary: OvermindSummaryDBModel }>) => {
    if (!gql || !gql.data || !gql.data.overmindsummary) return gql;

    const overmindSummary: OvermindSummaryDBModel = gql.data.overmindsummary;
    this.setState({ overmindSummary });
  }
}

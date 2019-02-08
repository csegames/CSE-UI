/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { LiveScenarioScoreboardQuery } from 'gql/interfaces';

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled('div')`
  align-self: center;
  display: flex;
  overflow: hidden;
  box-sizing: border-box !important;
  background-size: contain;
  z-index: 1;
  @media (max-width: 2560px) {
    background-image: url('images/scenario-live-score/1080/mini-hud-frame.png');
    width: 260px;
    height: 52px;
    padding-left: 17px;
    padding-right: 17px;
    padding-top: 3px;
  }
  @media (min-width: 2561px) {
    background-image: url('images/scenario-live-score/4k/mini-hud-frame.png');
    width: 260px;
    height: 52px;
    padding-left: 17px;
    padding-right: 17px;
    padding-top: 3px;
  }
`;

interface BackgroundProps {
  active?: boolean;
}

const backgroundCss = (props: BackgroundProps) => css`
  background-size: contain;
  position: relative;
  background: ${props.active ? 'none' : 'rgba(0,0,0,0.6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  @media (max-width: 2560px) {
    width: 71px;
    height: 40px;
  }
  @media (min-width: 2561px) {
    width: 71px;
    height: 40px;
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const ArthurianBackground: React.SFC<BackgroundProps> = styled('div')`
  ${backgroundCss}
  margin-left: 1px;
  color: #ffd7d7;
  &:before {
    @media (max-width: 2560px) {
      background-image: url('images/scenario-live-score/1080/mini-hud-art-bg.png');
    }
    @media (min-width: 2561px) {
      background-image: url('images/scenario-live-score/4k/mini-hud-art-bg.png');
    }
  }
`;

const VikingBackground: React.SFC<BackgroundProps> = styled('div')`
  ${backgroundCss}
  margin-left: 6px;
  color: #c7e7ff;
  &:before {
    @media (max-width: 2560px) {
      background-image: url('images/scenario-live-score/1080/mini-hud-vik-bg.png');
    }
    @media (min-width: 2561px) {
      background-image: url('images/scenario-live-score/4k/mini-hud-vik-bg.png');
    }
  }
`;

const TddBackground: React.SFC<BackgroundProps> = styled('div')`
  ${backgroundCss}
  margin-left: 5px;
  color: #d5ffc1;
  &:before {
    @media (max-width: 2560px) {
      background-image: url('images/scenario-live-score/1080/mini-hud-tdd-bg.png');
    }
    @media (min-width: 2561px) {
      background-image: url('images/scenario-live-score/4k/mini-hud-tdd-bg.png');
    }
  }
`;

// MOCK GQL TYPE ---------------------------------------------
// TODO remove this mock data, and replace with gql/interfaces
// tslint:disable-next-line no-namespace
// namespace MockLiveScenarioScoreboard {
//   export interface Subscription {
//     myActiveScenario: MyActiveScenario;
//   }
//   export interface MyActiveScenario {
//     id: ScenarioInstanceID;
//     shardID: ShardID;
//     startTime: Date;
//     rounds: RoundOutcome[];
//     activeRound: number;
//     teams: Team[];
//   }
//   export interface Team {
//     id: ScenarioTeamID;
//     name: ScenarioTeamID;
//     score: number;
//     players: Player[];
//   }
//   export interface Player {
//     entityID: EntityID;
//     name: string;
//     score: number;
//   }
// }
// END MOCK GQL TYPE -----------------------------------------

const query = gql`
  query LiveScenarioScoreboardQuery {
    myActiveScenarioScoreboard {
      id
      teams {
        tdd {
          score
        }
        viking {
          score
        }
        arthurian {
          score
        }
      }
    }
  }
`;

export interface Props {}

interface State {
  inScenario: boolean;
}

class LiveScenarioScoreboard extends React.Component<Props, State> {
  public render() {
    return (
      <GraphQL query={{ query, pollInterval: 5000 }}>
        {(graphql: GraphQLResult<LiveScenarioScoreboardQuery.Query>) => {
          if (!graphql.data || !graphql.data.myActiveScenarioScoreboard) {
            return null;
          }

          const scoreboard = graphql.data.myActiveScenarioScoreboard;
          return (
            <Wrapper>
              <Container>
                <ArthurianBackground active={game.selfPlayerState.faction === Faction.Arthurian}>
                  {scoreboard.teams.arthurian.score}
                </ArthurianBackground>
                <VikingBackground active={game.selfPlayerState.faction === Faction.Viking}>
                  {scoreboard.teams.viking.score}
                </VikingBackground>
                <TddBackground active={game.selfPlayerState.faction === Faction.TDD}>
                  {scoreboard.teams.tdd.score}
                </TddBackground>
              </Container>
            </Wrapper>
          );
        }}
      </GraphQL>
    );
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return false;
  }
}

export default LiveScenarioScoreboard;

// GraphQL Query/Subscription
// myActiveScenario {
//   id [ScenarioInstanceID]
//   shardID [ShardID]
//   startTime [Date]
//   rounds [RoundOutcome]
//   activeRound [Number]
//   teams [List<Team>] {
//     id [TeamID]
//     name [TeamID]
//     score [Number]
//     players [TeamPlayer] {
//       entityID [EntityID]
//       name [String]
//       score [Number]
//     }
//   }
// }

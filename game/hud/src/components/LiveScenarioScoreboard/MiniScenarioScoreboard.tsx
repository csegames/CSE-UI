/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { MiniScenarioScoreboardQuery } from 'gql/interfaces';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  align-self: center;
  display: flex;
  overflow: hidden;
  box-sizing: border-box !important;
  background-size: contain;
  background-image: url(../images/scenario-live-score/uhd/mini-hud-frame.png);
  width: 520px;
  height: 104px;
  padding-left: 34px;
  padding-right: 34px;
  padding-top: 6px;
  z-index: 1;

  @media (max-width: 1920px) {
    background-image: url(../images/scenario-live-score/hd/mini-hud-frame.png);
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

const backgroundCss = `
  background-size: contain;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  width: 142px;
  height: 80px;
  font-size: 32px;

  @media (max-width: 1920px) {
    width: 71px;
    height: 40px;
    font-size: 16px;
  }

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const ArthurianBackground: React.SFC<BackgroundProps> = styled.div`
  ${backgroundCss}
  background: ${(props: any) => props.active ? 'none' : 'rgba(0,0,0,0.6)'};
  margin-left: 1px;
  color: #ffd7d7;
  margin-left: 2px;

  &:before {
    background-image: url(../images/scenario-live-score/uhd/mini-hud-art-bg.png);
  }

  @media (max-width: 1920px) {
    margin-left: 0;
    &:before {
      background-image: url(../images/scenario-live-score/hd/mini-hud-art-bg.png);
    }
  }
`;

const VikingBackground: React.SFC<BackgroundProps> = styled.div`
  ${backgroundCss}
  background: ${(props: any) => props.active ? 'none' : 'rgba(0,0,0,0.6)'};
  color: #c7e7ff;
  margin-left: 12px;

  &:before {
    background-image: url(../images/scenario-live-score/uhd/mini-hud-vik-bg.png);
  }

  @media (max-width: 1920px) {
    margin-left: 6px;
    &:before {
      background-image: url(../images/scenario-live-score/hd/mini-hud-vik-bg.png);
    }
  }
`;

const TddBackground: React.SFC<BackgroundProps> = styled.div`
  ${backgroundCss}
  background: ${(props: any) => props.active ? 'none' : 'rgba(0,0,0,0.6)'};
  margin-left: 10px;
  color: #d5ffc1;
  &:before {
    background-image: url(../images/scenario-live-score/uhd/mini-hud-tdd-bg.png);
  }

  @media (max-width: 1920px) {
    margin-left: 5px;
    &:before {
      background-image: url(../images/scenario-live-score/hd/mini-hud-tdd-bg.png);
    }
  }
`;

const query = gql`
  query MiniScenarioScoreboardQuery {
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

export class MiniScenarioScoreboard extends React.PureComponent<Props> {
  public render() {
    return (
      <GraphQL query={{ query, pollInterval: 5000 }}>
        {(graphql: GraphQLResult<MiniScenarioScoreboardQuery.Query>) => {
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
                <TddBackground active={game.selfPlayerState.faction === Faction.TDD}>
                  {scoreboard.teams.tdd.score}
                </TddBackground>
                <VikingBackground active={game.selfPlayerState.faction === Faction.Viking}>
                  {scoreboard.teams.viking.score}
                </VikingBackground>
              </Container>
            </Wrapper>
          );
        }}
      </GraphQL>
    );
  }
}

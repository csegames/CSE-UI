/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { FullScenarioScoreboardQuery, TeamScore } from 'gql/interfaces';

const HEADER_HEIGHT = 76;
const HEADER_HEIGHT_UHD = HEADER_HEIGHT * 2;

const Container = styled.div`
  position: relative;
  cursor: default;
  display: flex;
  flex-direction: column;
  width: 2000px;
  height: 1000px;
  background-image: url('../images/scenario-live-score/uhd/bg.png');

  &:before {
    content: '';
    position: absolute;
    background: url(../images/scenario-live-score/uhd/corner-left-ornament.png) no-repeat;
    background-size: contain;
    left: -8px;
    top: -8px;
    width: 164px;
    height: 162px;
  }

  &:after {
    content: '';
    position: absolute;
    background: url(../images/scenario-live-score/uhd/corner-right-ornament.png) no-repeat;
    background-size: contain;
    right: -8px;
    top: -8px;
    width: 164px;
    height: 162px;
  }

  @media (max-width: 1920px) {
    width: 1000px;
    height: 500px;
    background: url(../images/scenario-live-score/hd/bg.png) no-repeat;
    background-size: cover;

    &:before {
      top: -2px;
      left: -2px;
      background: url(../images/scenario-live-score/hd/corner-left-ornament.png) no-repeat;
      background-size: contain;
      width: 82px;
      height: 82px;
      z-index: 1;
    }

    &:after {
      top: -2px;
      right: -2px;
      background: url(../images/scenario-live-score/hd/corner-right-ornament.png) no-repeat;
      background-size: contain;
      width: 82px;
      height: 82px;
      z-index: 1;
    }
  }
`;

const BottomRip = styled.div`
  position: absolute;
  bottom: -86px;
  height: 87px;
  width: 100%;
  background: url(../images/scenario-live-score/uhd/bottom-rip.png) no-repeat;
  background-size: 100% 100%;

  @media (max-width: 1920px) {
    bottom: -43px;
    height: 44px;
    width: 100%;
    background: url(../images/scenario-live-score/hd/bottom-rip.png) no-repeat;
    background-size: 100% 100%;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT_UHD}px;
  padding: 0 60px;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: url(../images/scenario-live-score/uhd/bottom-line-ornament.png) no-repeat;
    background-size: 100% 100%;
  }

  @media (max-width: 1920px) {
    height: ${HEADER_HEIGHT}px;
    padding: 0 30px;

    &:after {
      height: 2px;
      left: 0;
      right: 0;
      bottom: 0;
      background: url(../images/scenario-live-score/hd/bottom-line-ornament.png) no-repeat;
      background-size: 100% 100%;
    }
  }
`;

const HeaderBG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 0;
  width: 570px;
  background: url(../images/scenario-live-score/uhd/deathmatch-bg.png) no-repeat;
  background-size: contain;

  &.point-capture {
    background: url(../images/scenario-live-score/uhd/point-capture-bg.png) no-repeat;
    background-size: contain;
  }

  @media (max-width: 1920px) {
    width: 285px;
    background: url(../images/scenario-live-score/hd/deathmatch-bg.png) no-repeat;
    background-size: contain;
    &.point-capture {
      background: url(../images/scenario-live-score/hd/point-capture-bg.png) no-repeat;
      background-size: contain;
    }
  }
`;

const LeftHeaderOrnament = styled.div`
  position: absolute;
  background: url(../images/scenario-live-score/uhd/title-frame-left.png) no-repeat;
  background-size: contain;
  top: 14px;
  bottom: 10px;
  left: 4px;
  right: 0;

  @media (max-width: 1920px) {
    top: 7px;
    bottom: 5px;
    left: 2px;
    background: url(../images/scenario-live-score/hd/title-frame-left.png) no-repeat;
    background-size: contain;
  }
`;

const RightHeaderOrnament = styled.div`
  position: absolute;
  background: url(../images/scenario-live-score/uhd/title-frame-right.png) no-repeat;
  background-size: contain;
  background-position: right center;
  top: 14px;
  bottom: 10px;
  right: 4px;
  left: 0;

  @media (max-width: 1920px) {
    top: 7px;
    bottom: 5px;
    right: 2px;
    background: url(../images/scenario-live-score/hd/title-frame-right.png) no-repeat;
    background-size: contain;
    background-position: right center;
  }
`;

const HeaderText = styled.div`
  flex: 1;
  text-transform: uppercase;
  font-family: Caudex;
  color: white;
  z-index: 1;
  font-size: 40px;
  letter-spacing: 6px;

  @media (max-width: 1920px) {
    letter-spacing: 3px;
    font-size: 20px;
  }
`;

const RoundsContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const RoundItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: 130px;

  &.active {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      width: 492px;
      background: url(../images/scenario-live-score/uhd/flameglow.png) no-repeat;
      background-size: contain;
    }

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      top: -20px;
      height: 178px;
      width: 842px;
      background: url(../images/scenario-live-score/uhd/middle-ornament.png) no-repeat;
      background-size: contain;
    }

    @media (max-width: 1920px) {
      &:before {
        width: 246px;
        background: url(../images/scenario-live-score/hd/flameglow.png) no-repeat;
        background-size: contain;
      }

      &:after {
        top: -10px;
        height: 89px;
        width: 421px;
        background: url(../images/scenario-live-score/hd/middle-ornament.png) no-repeat;
        background-size: contain;
      }
    }
  }
`;

const RoundName = styled.div`
  font-size: 24px;
  letter-spacing: 2px;
  color: #EDEDED;

  @media (max-width: 1920px) {
    font-size: 12px;
    letter-spacing: 1px;
  }
`;

const RoundOutcome = styled.div`
  font-size: 30px;
  letter-spacing: 4px;
  font-family: Caudex;
  text-transform: uppercase;
  color: ${(props: { color: string }) => props.color};

  @media (max-width: 1920px) {
    font-size: 15px;
    letter-spacing: 2px;
  }
`;

const SectionsWrapper = styled.div`
  position: relative;
  margin: 2px 20px 0 20px;
  flex: 1;
  display: flex;
  justify-content: space-between;

  @media (max-width: 1920px) {
    width: calc(100% - 20px);
    margin: 1px 10px 0 10px;
  }
`;

const SectionBGContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
`;

const SectionBG = styled.div`
  flex: 1;
  margin: 0 3px;

  @media (max-width: 1920px) {
    margin: 0 1.5px;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  pointer-events: all;
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const Section = styled.div`
  flex: 1;
  margin: 0 3px;

  @media (max-width: 1920px) {
    margin: 0 1.5px;
  }
`;

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-family: Caudex;
  font-size: 32px;
  letter-spacing: 2px;
  padding: 20px 40px;
  margin-bottom: 10px;
  color: ${(props: { color: string }) => props.color};

  border-image: linear-gradient(to right, transparent, black, transparent);
  border-image-slice: 1;
  border-style: solid;
  border-bottom-width: 2px;

  @media (max-width: 1920px) {
    font-size: 16px;
    letter-spacing: 1px;
    margin-bottom: 5px;
    padding: 10px 20px;
    border-bottom-width: 1px;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-family: TitilliumWeb;
  color: white;
  font-size: 28px;
  letter-spacing: 2px;
  width: calc(100% - 80px);
  padding: 10px 40px;

  @media (max-width: 1920px) {
    width: calc(100% - 40px);
    padding: 5px 20px;
    letter-spacing: 1px;
    font-size: 14px;
  }
`;

const PlayerName = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
`;

const query = gql`
  query FullScenarioScoreboardQuery {
    myActiveScenarioScoreboard {
      id
      name
      rounds {
        active
        roundIndex
        winningTeamIDs
      }
      teams {
        tdd {
          score
          players {
            name
            score
          }
        }
        viking {
          score
          players {
            name
            score
          }
        }
        arthurian {
          score
          players {
            name
            score
          }
        }
      }
    }
  }
`;

export interface Props {

}

export interface State {
  visible: boolean;
}

export class FullScenarioScoreboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  public render() {
    return this.state.visible ? (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<FullScenarioScoreboardQuery.Query>) => {
          const activeScenarioData = graphql.data && graphql.data.myActiveScenarioScoreboard;
          const sortedTeams = activeScenarioData && Object.keys(activeScenarioData.teams).sort((a, b) => a.localeCompare(b));

          return (
            <UIContext.Consumer>
              {(uiContext: UIContext) => {
                const theme = uiContext.currentTheme();
                return (
                  <Container data-input-group='block'>
                    <Header>
                      <HeaderBG className={this.getHeaderBGClass(activeScenarioData && activeScenarioData.name)} />
                      <LeftHeaderOrnament />
                      <RightHeaderOrnament />

                      <HeaderText>{activeScenarioData && activeScenarioData.name}</HeaderText>
                      <RoundsContainer>
                        {activeScenarioData && activeScenarioData.rounds.map((round, i) => {
                          const winningTeam = round.winningTeamIDs ? round.winningTeamIDs[0] : 'In Progress';
                          const outcomeColor = theme.scenarioScoreboard.color.text[this.getWinningTeamTextKey(winningTeam)];
                          return (
                            <RoundItem className={round.active ? 'active' : ''}>
                              <RoundName>Round {round.roundIndex + 1}</RoundName>
                              <RoundOutcome color={outcomeColor}>
                                {winningTeam}
                              </RoundOutcome>
                            </RoundItem>
                          );
                        })}
                      </RoundsContainer>
                      <div style={{ flex: 1 }} />
                    </Header>
                    <SectionsWrapper>
                      <SectionBGContainer>
                        {activeScenarioData && sortedTeams.map((teamKey, i) => {
                          const bgColor = theme.scenarioScoreboard.color.background[this.getTeamColorKey(teamKey)];
                          return (
                            <SectionBG style={{ background: `linear-gradient(to bottom, ${bgColor}, transparent 90%)` }} />
                          );
                        })}
                      </SectionBGContainer>
                      <ContentContainer data-input-group='block' className='cse-ui-scroller-thumbonly'>
                        {activeScenarioData && sortedTeams.map((teamKey) => {
                          const team: TeamScore = activeScenarioData.teams[teamKey];
                          const sortedPlayers = team.players.sort((a, b) => b.score - a.score);
                          const textColor = theme.scenarioScoreboard.color.text[this.getTeamColorKey(teamKey)];
                          return (
                            <Section>
                              <SectionHeader color={textColor}>
                                <div>{team.players.length} {this.getTeamName(teamKey)}</div>
                                {team.score}
                              </SectionHeader>
                              {sortedPlayers.map((player, i) => (
                                <ListItem>
                                  <PlayerName>{i + 1}) {player.name}</PlayerName>
                                  {player.score}
                                </ListItem>
                              ))}
                            </Section>
                          );
                        })}
                      </ContentContainer>
                    </SectionsWrapper>

                    <BottomRip />
                  </Container>
                );
              }}
            </UIContext.Consumer>
          );
        }}
      </GraphQL>
    ) : null;
  }

  public componentDidMount() {
    game.on('navigate', this.handleNavigation);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextState.visible !== this.state.visible;
  }

  private handleNavigation = (name: string) => {
    if (name === 'scenarioscoreboard') {
      this.setState({ visible: !this.state.visible });
    }
  }

  private getHeaderBGClass = (scenarioName: string) => {
    if (!scenarioName) return '';

    const normalizedScenarioName = scenarioName.replace(' ', '').toLowerCase();
    if (normalizedScenarioName.includes('pointcapture')) {
      return 'point-capture';
    }

    return '';
  }

  private getWinningTeamTextKey = (winningTeam: string) => {
    switch (winningTeam) {
      case 'Arthurian': {
        return Faction.Arthurian;
      }
      case 'Tuatha': {
        return Faction.TDD;
      }
      case 'Viking': {
        return Faction.Viking;
      }
      default: {
        return 'progress';
      }
    }
  }

  private getTeamColorKey = (teamKey: string) => {
    switch (teamKey) {
      case 'arthurian': {
        return Faction.Arthurian;
      }
      case 'viking': {
        return Faction.Viking;
      }
      case 'tdd': {
        return Faction.TDD;
      }
      default: {
        return Faction.Factionless;
      }
    }
  }

  private getTeamName = (teamKey: string) => {
    switch (teamKey) {
      case 'arthurian': {
        return 'Arthurians';
      }
      case 'viking': {
        return 'Vikings';
      }
      case 'tdd': {
        return 'Tuatha De Danaan';
      }
      default: {
        return 'Unknown';
      }
    }
  }
}

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { FullScenarioScoreboardQuery, TeamScore } from 'gql/interfaces';
import { CloseButton } from 'cseshared/components/CloseButton';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_WIDTH = 2000;
const CONTAINER_HEIGHT = 1000;
const CONTAINER_ORNAMENT_ALIGNMENT = -8;
const CONTAINER_ORNAMENT_WIDTH = 164;
const CONTAINER_ORNAMENT_HEIGHT = 162;
// #endregion
const Container = styled.div`
  position: relative;
  cursor: default;
  display: flex;
  flex-direction: column;
  width: ${CONTAINER_WIDTH}px;
  height: ${CONTAINER_HEIGHT}px;
  background-image: url(../images/scenario-live-score/uhd/bg.png);

  &:before {
    content: '';
    position: absolute;
    background-image: url(../images/scenario-live-score/uhd/corner-left-ornament.png);
    background-repeat: no-repeat;
    background-size: contain;
    left: ${CONTAINER_ORNAMENT_ALIGNMENT}px;
    top: ${CONTAINER_ORNAMENT_ALIGNMENT}px;
    width: ${CONTAINER_ORNAMENT_WIDTH}px;
    height: ${CONTAINER_ORNAMENT_HEIGHT}px;
  }

  &:after {
    content: '';
    position: absolute;
    background-image: url(../images/scenario-live-score/uhd/corner-right-ornament.png);
    background-repeat: no-repeat;
    background-size: contain;
    right: ${CONTAINER_ORNAMENT_ALIGNMENT}px;
    top: ${CONTAINER_ORNAMENT_ALIGNMENT}px;
    width: ${CONTAINER_ORNAMENT_WIDTH}px;
    height: ${CONTAINER_ORNAMENT_HEIGHT}px;
  }

  @media (max-width: 2560px) {
    width: ${CONTAINER_WIDTH * MID_SCALE}px;
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;

    &:before {
      left: ${CONTAINER_ORNAMENT_ALIGNMENT * MID_SCALE}px;
      top: ${CONTAINER_ORNAMENT_ALIGNMENT * MID_SCALE}px;
      width: ${CONTAINER_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
      z-index: 1;
    }

    &:after {
      right: ${CONTAINER_ORNAMENT_ALIGNMENT * MID_SCALE}px;
      top: ${CONTAINER_ORNAMENT_ALIGNMENT * MID_SCALE}px;
      width: ${CONTAINER_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
      z-index: 1;
    }
  }

  @media (max-width: 1920px) {
    width: ${CONTAINER_WIDTH * HD_SCALE}px;
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
    background-image: url(../images/scenario-live-score/hd/bg.png);

    &:before {
      background-image: url(../images/scenario-live-score/hd/corner-left-ornament.png);
      left: ${CONTAINER_ORNAMENT_ALIGNMENT * HD_SCALE}px;
      top: ${CONTAINER_ORNAMENT_ALIGNMENT * HD_SCALE}px;
      width: ${CONTAINER_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
      z-index: 1;
    }

    &:after {
      background-image: url(../images/scenario-live-score/hd/corner-right-ornament.png);
      right: ${CONTAINER_ORNAMENT_ALIGNMENT * HD_SCALE}px;
      top: ${CONTAINER_ORNAMENT_ALIGNMENT * HD_SCALE}px;
      width: ${CONTAINER_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
      z-index: 1;
    }
  }
`;

// #region CloseButtonPosition constants
const CLOSE_BUTTON_POSITION_TOP = 30;
const CLOSE_BUTTON_POSITION_RIGHT = 20;
// #endregion
const CloseButtonPosition = css`
  position: absolute;
  top: ${CLOSE_BUTTON_POSITION_TOP}px;
  right: ${CLOSE_BUTTON_POSITION_RIGHT}px;

  @media (max-width: 2560px) {
    top: ${CLOSE_BUTTON_POSITION_TOP * MID_SCALE}px;
    right: ${CLOSE_BUTTON_POSITION_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CLOSE_BUTTON_POSITION_TOP * HD_SCALE}px;
    right: ${CLOSE_BUTTON_POSITION_RIGHT * HD_SCALE}px;
  }
`;

// #region BottomRip constants
const BOTTOM_RIP_BOTTOM = -86;
const BOTTOM_RIP_HEIGHT = 87;
// #endregion
const BottomRip = styled.div`
  position: absolute;
  bottom: ${BOTTOM_RIP_BOTTOM}px;
  height: ${BOTTOM_RIP_HEIGHT}px;
  width: 100%;
  background-image: url(../images/scenario-live-score/uhd/bottom-rip.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;

  @media (max-width: 2560px) {
    bottom: ${BOTTOM_RIP_BOTTOM * MID_SCALE}px;
    height: ${BOTTOM_RIP_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${BOTTOM_RIP_BOTTOM * HD_SCALE}px;
    height: ${BOTTOM_RIP_HEIGHT * HD_SCALE}px;
    background-image: url(../images/scenario-live-score/hd/bottom-rip.png);
  }
`;

// #region Header constants
const HEADER_HEIGHT = 152;
const HEADER_PADDING_HORIZONTAL = 60;
const HEADER_ORNAMENT_HEIGHT = 4;
// #endregion
const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT}px;
  padding: 0 ${HEADER_PADDING_HORIZONTAL}px;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${HEADER_ORNAMENT_HEIGHT}px;
    background-image: url(../images/scenario-live-score/uhd/bottom-line-ornament.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  @media (max-width: 2560px) {
    height: ${HEADER_HEIGHT * MID_SCALE}px;
    padding: 0 ${HEADER_PADDING_HORIZONTAL * MID_SCALE}px;

    &:after {
      height: ${HEADER_ORNAMENT_HEIGHT * HD_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    height: ${HEADER_HEIGHT * HD_SCALE}px;
    padding: 0 ${HEADER_PADDING_HORIZONTAL * HD_SCALE}px;

    &:after {
      height: ${HEADER_ORNAMENT_HEIGHT * HD_SCALE}px;
      background-image: url(../images/scenario-live-score/hd/bottom-line-ornament.png);
    }
  }
`;

// #region HeaderBG constants
const HEADER_BG_WIDTH = 570;
// #endregion
const HeaderBG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 0;
  width: ${HEADER_BG_WIDTH}px;
  background-image: url(../images/scenario-live-score/uhd/deathmatch-bg.png);
  background-repeat: no-repeat;
  background-size: contain;

  &.point-capture {
    background-image: url(../images/scenario-live-score/uhd/point-capture-bg.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  @media (max-width: 2560px) {
    width: ${HEADER_BG_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${HEADER_BG_WIDTH * HD_SCALE}px;
    background-image: url(../images/scenario-live-score/hd/deathmatch-bg.png);
    &.point-capture {
      background-image: url(../images/scenario-live-score/hd/point-capture-bg.png);
    }
  }
`;

// #region LeftHeaderOrnament constants
const HEADER_ORNAMENT_TOP = 14;
const HEADER_ORNAMENT_BOTTOM = 10;
const HEADER_ORNAMENT_HORIZONTAL = 4;
// #endregion
const LeftHeaderOrnament = styled.div`
  position: absolute;
  background-image: url(../images/scenario-live-score/uhd/title-frame-left.png);
  background-repeat: no-repeat;
  background-size: contain;
  top: ${HEADER_ORNAMENT_TOP}px;
  bottom: ${HEADER_ORNAMENT_BOTTOM}px;
  left: ${HEADER_ORNAMENT_HORIZONTAL}px;
  right: 0;

  @media (max-width: 2560px) {
    top: ${HEADER_ORNAMENT_TOP * MID_SCALE}px;
    bottom: ${HEADER_ORNAMENT_BOTTOM * MID_SCALE}px;
    left: ${HEADER_ORNAMENT_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${HEADER_ORNAMENT_TOP * HD_SCALE}px;
    bottom: ${HEADER_ORNAMENT_BOTTOM * HD_SCALE}px;
    left: ${HEADER_ORNAMENT_HORIZONTAL * HD_SCALE}px;
    background-image: url(../images/scenario-live-score/hd/title-frame-left.png);
  }
`;

const RightHeaderOrnament = styled.div`
  position: absolute;
  background-image: url(../images/scenario-live-score/uhd/title-frame-right.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  top: ${HEADER_ORNAMENT_TOP}px;
  bottom: ${HEADER_ORNAMENT_BOTTOM}px;
  right: ${HEADER_ORNAMENT_HORIZONTAL}px;
  left: 0;

  @media (max-width: 2560px) {
    top: ${HEADER_ORNAMENT_TOP * MID_SCALE}px;
    bottom: ${HEADER_ORNAMENT_BOTTOM * MID_SCALE}px;
    right: ${HEADER_ORNAMENT_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${HEADER_ORNAMENT_TOP * HD_SCALE}px;
    bottom: ${HEADER_ORNAMENT_BOTTOM * HD_SCALE}px;
    right: ${HEADER_ORNAMENT_HORIZONTAL * HD_SCALE}px;
    background-image: url(../images/scenario-live-score/hd/title-frame-right.png);
  }
`;

// #region HeaderText constants
const HEADER_TEXT_FONT_SIZE = 40;
const HEADER_TEXT_LETTER_SPACING = 6;
// #endregion
const HeaderText = styled.div`
  flex: 1;
  text-transform: uppercase;
  font-family: Caudex;
  color: white;
  z-index: 1;
  font-size: ${HEADER_TEXT_FONT_SIZE}px;
  letter-spacing: ${HEADER_TEXT_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    font-size: ${HEADER_TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${HEADER_TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEADER_TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${HEADER_TEXT_LETTER_SPACING * HD_SCALE}px;
  }
`;

const RoundsContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

// #region RoundItem constants
const ROUND_ITEM_MIN_WIDTH = 130;
const ROUND_ITEM_FLAME_WIDTH = 492;
const ROUND_ITEM_ORNAMENT_TOP = -20;
const ROUND_ITEM_ORNAMENT_HEIGHT = 178;
const ROUND_ITEM_ORNAMENT_WIDTH = 842;
// #endregion
const RoundItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: ${ROUND_ITEM_MIN_WIDTH}px;

  &.active {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      width: ${ROUND_ITEM_FLAME_WIDTH}px;
      background-image: url(../images/scenario-live-score/uhd/flameglow.png);
      background-repeat: no-repeat;
      background-size: contain;
    }

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      top: ${ROUND_ITEM_ORNAMENT_TOP}px;
      height: ${ROUND_ITEM_ORNAMENT_HEIGHT}px;
      width: ${ROUND_ITEM_ORNAMENT_WIDTH}px;
      background-image url(../images/scenario-live-score/uhd/middle-ornament.png);
      background-repeat: no-repeat;
      background-size: contain;
    }

    @media (max-width: 2560px) {
      &:before {
        width: ${ROUND_ITEM_FLAME_WIDTH * MID_SCALE}px;
      }

      &:after {
        top: ${ROUND_ITEM_ORNAMENT_TOP * MID_SCALE}px;
        height: ${ROUND_ITEM_ORNAMENT_HEIGHT * MID_SCALE}px;
        width: ${ROUND_ITEM_ORNAMENT_WIDTH * MID_SCALE}px;
      }
    }

    @media (max-width: 1920px) {
      &:before {
        width: ${ROUND_ITEM_FLAME_WIDTH * HD_SCALE}px;
        background-image: url(../images/scenario-live-score/hd/flameglow.png);
      }

      &:after {
        top: ${ROUND_ITEM_ORNAMENT_TOP * HD_SCALE}px;
        height: ${ROUND_ITEM_ORNAMENT_HEIGHT * HD_SCALE}px;
        width: ${ROUND_ITEM_ORNAMENT_WIDTH * HD_SCALE}px;
        background-image: url(../images/scenario-live-score/hd/middle-ornament.png);
      }
    }
  }
`;

// #region RoundName constants
const ROUND_NAME_FONT_SIZE = 24;
const ROUND_NAME_LETTER_SPACING = 2;
// #endregion
const RoundName = styled.div`
  font-size: ${ROUND_NAME_FONT_SIZE}px;
  letter-spacing: ${ROUND_NAME_LETTER_SPACING}px;
  color: #EDEDED;

  @media (max-width: 2560px) {
    font-size: ${ROUND_NAME_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${ROUND_NAME_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ROUND_NAME_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${ROUND_NAME_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region RoundOutcome constants
const ROUND_OUTCOME_FONT_SIZE = 30;
const ROUND_OUTCOME_LETTER_SPACING = 4;
// #endregion
const RoundOutcome = styled.div`
  font-size: ${ROUND_OUTCOME_FONT_SIZE}px;
  letter-spacing: ${ROUND_OUTCOME_LETTER_SPACING}px;
  font-family: Caudex;
  text-transform: uppercase;
  color: ${(props: { color: string }) => props.color};

  @media (max-width: 2560px) {
    font-size: ${ROUND_OUTCOME_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${ROUND_OUTCOME_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ROUND_OUTCOME_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${ROUND_OUTCOME_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region SectionWrapper constants
const SECTION_WRAPPER_MARGIN_TOP = 2;
const SECTION_WRAPPER_MARGIN_HORIZONTAL = 20;
// #endregion
const SectionsWrapper = styled.div`
  position: relative;
  margin: ${SECTION_WRAPPER_MARGIN_TOP}px ${SECTION_WRAPPER_MARGIN_HORIZONTAL}px 0 ${SECTION_WRAPPER_MARGIN_HORIZONTAL}px;
  width: calc(100% - ${SECTION_WRAPPER_MARGIN_HORIZONTAL * 2}px);
  flex: 1;
  display: flex;
  justify-content: space-between;

  @media (max-width: 2560px) {
    margin: ${SECTION_WRAPPER_MARGIN_TOP * MID_SCALE}px ${SECTION_WRAPPER_MARGIN_HORIZONTAL * MID_SCALE}px 0
    ${SECTION_WRAPPER_MARGIN_HORIZONTAL * MID_SCALE}px;
    width: calc(100% - ${(SECTION_WRAPPER_MARGIN_HORIZONTAL * 2) * MID_SCALE}px);
  }

  @media (max-width: 1920px) {
    margin: ${SECTION_WRAPPER_MARGIN_TOP * HD_SCALE}px ${SECTION_WRAPPER_MARGIN_HORIZONTAL * HD_SCALE}px 0
    ${SECTION_WRAPPER_MARGIN_HORIZONTAL * HD_SCALE}px;
    width: calc(100% - ${(SECTION_WRAPPER_MARGIN_HORIZONTAL * 2) * HD_SCALE}px);
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

// #region SectionBG constants
const SECTION_BG_MARGIN_HORIZONTAL = 3;
// #endregion
const SectionBG = styled.div`
  flex: 1;
  margin: 0 ${SECTION_BG_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    margin: 0 ${SECTION_BG_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: 0 ${SECTION_BG_MARGIN_HORIZONTAL * HD_SCALE}px;
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

// #region Section constants
const SECITON_MARGIN_HORIZONTAL = 3;
// #endregion
const Section = styled.div`
  flex: 1;
  margin: 0 ${SECITON_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    margin: 0 ${SECITON_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: 0 ${SECITON_MARGIN_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region SectionHeader constants
const SECTION_HEADER_FONT_SIZE = 32;
const SECTION_HEADER_LETTER_SPACING = 2;
const SECTION_HEADER_PADDING_VERTICAL = 20;
const SECTION_HEADER_PADDING_HORIZONTAL = 40;
const SECTION_HEADER_MARGIN_BOTTOM = 10;
const SECTION_HEADER_BORDER_BOTTOMW_WIDTH = 2;
// #endregion
const SectionHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-family: Caudex;
  font-size: ${SECTION_HEADER_FONT_SIZE}px;
  letter-spacing: ${SECTION_HEADER_LETTER_SPACING}px;
  padding: ${SECTION_HEADER_PADDING_VERTICAL}px ${SECTION_HEADER_PADDING_HORIZONTAL}px;
  margin-bottom: ${SECTION_HEADER_MARGIN_BOTTOM}px;
  color: ${(props: { color: string }) => props.color};

  border-bottom-width: ${SECTION_HEADER_BORDER_BOTTOMW_WIDTH}px;
  border-image: linear-gradient(to right, transparent, black, transparent);
  border-image-slice: 1;
  border-style: solid;

  @media (max-width: 2560px) {
    font-size: ${SECTION_HEADER_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${SECTION_HEADER_LETTER_SPACING * MID_SCALE}px;
    padding: ${SECTION_HEADER_PADDING_VERTICAL * MID_SCALE}px ${SECTION_HEADER_PADDING_HORIZONTAL * MID_SCALE}px;
    margin-bottom: ${SECTION_HEADER_MARGIN_BOTTOM * MID_SCALE}px;
    border-bottom-width: ${SECTION_HEADER_BORDER_BOTTOMW_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_HEADER_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${SECTION_HEADER_LETTER_SPACING * HD_SCALE}px;
    padding: ${SECTION_HEADER_PADDING_VERTICAL * HD_SCALE}px ${SECTION_HEADER_PADDING_HORIZONTAL * HD_SCALE}px;
    margin-bottom: ${SECTION_HEADER_MARGIN_BOTTOM * HD_SCALE}px;
    border-bottom-width: ${SECTION_HEADER_BORDER_BOTTOMW_WIDTH * HD_SCALE}px;
  }
`;

// #region ListItem constants
const LIST_ITEM_FONT_SIZE = 28;
const LIST_ITEM_LETTER_SPACING = 2;
const LIST_ITEM_PADDING_VERTICAL = 10;
const LIST_ITEM_PADDING_HORIZONTAL = 40;
// #endregion
const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-family: TitilliumWeb;
  color: white;
  font-size: ${LIST_ITEM_FONT_SIZE}px;
  letter-spacing: ${LIST_ITEM_LETTER_SPACING}px;
  width: calc(100% - ${LIST_ITEM_PADDING_HORIZONTAL * 2}px);
  padding: ${LIST_ITEM_PADDING_VERTICAL}px ${LIST_ITEM_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    font-size: ${LIST_ITEM_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${LIST_ITEM_LETTER_SPACING * MID_SCALE}px;
    width: calc(100% - ${(LIST_ITEM_PADDING_HORIZONTAL * 2) * MID_SCALE}px);
    padding: ${LIST_ITEM_PADDING_VERTICAL * MID_SCALE}px ${LIST_ITEM_PADDING_HORIZONTAL * MID_SCALE}px;
  }


  @media (max-width: 1920px) {
    font-size: ${LIST_ITEM_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${LIST_ITEM_LETTER_SPACING * HD_SCALE}px;
    width: calc(100% - ${(LIST_ITEM_PADDING_HORIZONTAL * 2) * HD_SCALE}px);
    padding: ${LIST_ITEM_PADDING_VERTICAL * HD_SCALE}px ${LIST_ITEM_PADDING_HORIZONTAL * HD_SCALE}px;
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
                    <CloseButton className={CloseButtonPosition} onClick={this.onClose} />
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

  private onClose = () => {
    this.setState({ visible: false });
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

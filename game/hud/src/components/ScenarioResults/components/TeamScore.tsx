/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import styled, { css, keyframes } from 'react-emotion';
import { FactionColors } from 'lib/factionColors';
import { TeamInterface } from './ScenarioResultsContainer';
import {
  getFilteredWinningTeams,
  getMainWinningTeam,
  getMyFactionTeam,
  getOtherTeams,
  hasMiscellaneousOutcome,
  isMiscellaneousOutcome,
} from '../utils';

const WaitTillWidgetSlideIn = css`
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const glow = keyframes`
  0% {
    -webkit-filter: brightness(100%);
    filter: brightness(100%);
  }

  50% {
    -webkit-filter: brightness(175%);
    filter: brightness(175%);
  }

  100% {
    -webkit-filter: brightness(100%);
    filter: brightness(100%);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    bottom: -20px;
  }
  to {
    opacity: 1;
    bottom: 0px;
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    left: -75px;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
    left: 0px;
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    right: -75px;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
    right: 0px;
  }
`;

const Container = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  font-family: Caudex;
`;

const Divider = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #5D5D5D, transparent);
`;

const TeamContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  background: linear-gradient(${(props: any) => props.daWay}, ${(props: any) => props.backgroundColor}, rgba(0,0,0,0.2));
  margin: ${(props: any) => props.margin};
  color: ${(props: any) => props.color};
  -webkit-clip-path: ${(props: any) => props.clipPath};
  clip-path: ${(props: any) => props.clipPath};
  text-transform: uppercase;
  z-index: 1;
  opacity: 0;
  -webkit-animation: ${(props: any) => props.fromLeft ?
    `${slideInFromLeft} 0.5s ease forwards` : `${slideInFromRight} 0.5s ease forwards`};
  animation: ${(props: any) => props.fromLeft ?
    `${slideInFromLeft} 0.5s ease forwards` : `${slideInFromRight} 0.5s ease forwards`};
  ${WaitTillWidgetSlideIn};
`;

const TeamName = styled('div')`
  position: absolute;
  font-size: 22px;
  letter-spacing: 3px;
  margin: ${(props: any) => props.margin};
  left: ${(props: any) => props.left};
  right: ${(props: any) => props.right};
`;

// const Score = styled('div')`
//   color: white;
//   font-size: 16px;
//   letter-spacing: 2px;
// `;

const VictoryTeamContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 130px;
  -webkit-clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
  clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
  color: ${(props: any) => props.color};
  text-transform: uppercase;
  z-index: 2;
  opacity: 0;
  background: linear-gradient(${(props: any) => props.daWay}, ${(props: any) => props.backgroundColor}, rgba(0,0,0,0.2));
  -webkit-animation: ${fadeIn} 0.5s ease forwards, ${glow} 2s ease infinite;
  animation: ${fadeIn} 0.5s ease forwards, ${glow} 2s ease infinite;
  ${WaitTillWidgetSlideIn}
`;

const LeftVictoryOrnament = styled('div')`
  position: absolute;
  background: url(images/scenario-results/left-divider-ornament.png) no-repeat;
  left: 10px;
  top: 10px;
  height: 100%;
  width: 100%;
`;

const RightVictoryOrnament = styled('div')`
  position: absolute;
  background: url(images/scenario-results/right-divider-ornament.png) no-repeat;
  right: 0px;
  top: 10px;
  height: 100%;
  width: 75px;
`;


const BottomMidOrnament = styled('div')`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -13px;
  height: 30%;
  background: url(images/scenario-results/bottom-mid-ornament.png) no-repeat center;
  z-index: 10;
`;

const OutcomeTeamName = styled('div')`
  margin-top: 10px;
  font-size: 26px;
  letter-spacing: 3px;
`;

const OutcomeText = styled('div')`
  margin-top: -3px;
  font-size: 13px;
  letter-spacing: 2.5px;
`;

// const VictoryScore = styled('div')`
//   color: white;
//   font-size: 18px;
//   letter-spacing: 2px;
// `;

const OutcomeContent = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  -webkit-animation: ${slideUp} 0.5s ease forwards;
  animation: ${slideUp} 0.5s ease forwards;
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
`;

export interface TeamScoreProps {
  teams: TeamInterface[];
  scenarioID: string;
}

class TeamScore extends React.Component<TeamScoreProps> {
  public render() {
    const { sortedTeams, mainTeam } = this.getSortedTeams();
    return (
      <Container>
        <BottomMidOrnament />
        <Divider />
        {sortedTeams.map((team, i) => {
          const isMainTeam = team.teamID === mainTeam.teamID;
          const colors = FactionColors[team.teamID];
          const outcomeText = team.outcome === 'Win' ? 'Victory!' : `${team.outcome}!`;
          if (isMainTeam) {
            return (
              <div key={i} style={{ position: 'relative' }}>
                <LeftVictoryOrnament />
                <VictoryTeamContainer
                  key={i}
                  daWay={'to top'}
                  color={colors.textColor}
                  backgroundColor={colors.backgroundColor}
                >
                  {(team.outcome === 'Win' || isMiscellaneousOutcome(team.outcome)) &&
                    <OutcomeContent>
                      <OutcomeTeamName>{team.teamID}</OutcomeTeamName>
                      <OutcomeText>{outcomeText}</OutcomeText>
                    </OutcomeContent>
                  }
                </VictoryTeamContainer>
                <RightVictoryOrnament />
              </div>
            );
          } else {
            const isLeft = i === 0;
            return (
              <TeamContainer
                key={i}
                fromLeft={isLeft}
                daWay={isLeft ? 'to left' : 'to right'}
                margin={isLeft ? '0 -80px 0 0' : '0 0 0 -80px'}
                clipPath={isLeft ? 'polygon(0% 0%,80% 0%,100% 100%,0% 100%)' :
                  'polygon(20% 0%,100% 0%,100% 100%,0% 100%)'}
                color={colors.textColor}
                backgroundColor={colors.backgroundColor}>
                {team.outcome !== 'Win' && !isMiscellaneousOutcome(team.outcome) &&
                  <TeamName left={!isLeft ? '80px' : ''} right={isLeft ? '80px' : ''}>{team.teamID}</TeamName>
                }
                {(team.outcome === 'Win' || isMiscellaneousOutcome(team.outcome)) &&
                  <OutcomeContent>
                    <OutcomeTeamName>{team.teamID}</OutcomeTeamName>
                    <OutcomeText>{outcomeText}</OutcomeText>
                  </OutcomeContent>
                }
              </TeamContainer>
            );
          }
        })}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: TeamScoreProps) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      !isEqual(this.props.teams, nextProps.teams);
  }

  public componentDidCatch(error: Error, info: any) {
    console.log(error);
    console.log(info);
  }

  private getSortedTeams = () => {
    const teams = [...this.props.teams];
    if (hasMiscellaneousOutcome(teams)) {
      return this.getSortedMiscOutcomeTeams(teams);
    }

    return this.getSortedNormalTeams(teams);
  }

  private getSortedMiscOutcomeTeams = (teams: TeamInterface[]) => {
    const mainTeam = getMyFactionTeam(teams);
    const sortedTeams = getOtherTeams(teams, mainTeam.teamID);
    sortedTeams.splice(Math.floor(sortedTeams.length / 2), 0, mainTeam);
    return {
      sortedTeams,
      mainTeam,
    };
  }

  private getSortedNormalTeams = (teams: TeamInterface[]) => {
    const filteredWinningTeams = getFilteredWinningTeams(teams);
    const mainTeam = getMainWinningTeam(filteredWinningTeams);
    const sortedTeams = getOtherTeams(teams, mainTeam.teamID);

    sortedTeams.splice(Math.floor(sortedTeams.length / 2), 0, mainTeam);
    return {
      sortedTeams,
      mainTeam,
    };
  }
}

export default TeamScore;

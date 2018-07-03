/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { keyframes, css } from 'react-emotion';
import { CloseButton } from 'UI/CloseButton';

import List from './List';
import { TeamInterface, TeamPlayer } from './ScenarioResultsContainer';
import HUDZOrder from 'services/session/HUDZOrder';

const slideIn = keyframes`
  from {
    top: -200px;
    opacity: 0;
  }
  to {
    top: 0px;
    opacity: 1;
  }
`;

const Container = styled('div')`
  display: ${(props: any) => props.display};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 1282px;
  height: 720px;
  pointer-events: all;
  -webkit-animation: ${slideIn} 0.5s ease forwards;
  animation: ${slideIn} 0.5s ease forwards;
  z-index: ${HUDZOrder.Scoreboard};
  &:before {
    content: '';
    position: absolute;
    top: -7px;
    right: 0;
    left: 0;
    height: 1%;
    background: url(images/scenario-results/top-repeat.png);
  }

  &:after {
    content: '';
    position: absolute;
    top: -49px;
    right: 0;
    left: 0;
    height: 10%;
    background: url(images/scenario-results/top-mid-ornament.png) no-repeat center;
  }
`;

const LeftOrnament = styled('div')`
  position: absolute;
  left: -20px;
  top: -30px;
  width: 40px;
  height: 55px;
  background: url(images/scenario-results/left-corner-ornament.png) no-repeat;
  z-index: 10;
`;

const CloseOrnament = styled('div')`
  position: absolute;
  right: -20px;
  top: -30px;
  width: 60px;
  height: 55px;
  background: url(images/scenario-results/close-ornament.png) no-repeat;
  z-index: 10;
`;

const CloseButtonPosition = css`
  position: absolute;
  text-align:center;
  top: 1px;
  right: -9px;
`;

export interface ScenarioResultsViewProps {
  scenarioID: string;
  visible: boolean;
  participants: TeamPlayer[];
  teams: TeamInterface[];
  onCloseClick: () => void;
  status: {
    loading: boolean;
    lastError: string;
  };
}

class ScenarioResultsView extends React.Component<ScenarioResultsViewProps> {
  public render() {
    const { visible, participants, teams, status, scenarioID } = this.props;
    return (
      <Container display={this.props.visible ? 'block' : 'none'}>
        <LeftOrnament />
        <CloseOrnament />
        <CloseButton width={30} height={30} className={CloseButtonPosition} onClick={this.props.onCloseClick} />
        <List visible={visible} players={participants} teams={teams} status={status} scenarioID={scenarioID} />
      </Container>
    );
  }


  public shouldComponentUpdate(nextProps: ScenarioResultsViewProps) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      this.props.visible !== nextProps.visible ||
      this.props.status.loading !== nextProps.status.loading ||
      this.props.status.lastError !== nextProps.status.lastError ||
      !_.isEqual(this.props.teams, nextProps.teams) ||
      !_.isEqual(this.props.participants, nextProps.participants);
  }
}

export default ScenarioResultsView;

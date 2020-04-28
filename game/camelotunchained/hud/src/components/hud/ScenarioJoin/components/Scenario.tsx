/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from 'shared/Button';
import { ScenarioMatch, scenarioIsAvailable, pollNow } from 'services/session/scenarioQueue';

const ScenarioContainer = styled.div`
  display: block;
  position: relative;
  min-height: 112px;
  max-height: 112px;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 0 0;
  border: 1px solid rgba(128,128,128,0.5);
  box-sizing: border-box!important;
`;

const ScenarioTitle = styled.div`
  font-family: 'Caudex', serif;
  position: absolute;
  top: 20px;
  left: 160px;
  width: 450px;
  font-size: 20px;
  color: #f5d797;
  text-transform: uppercase;
  letter-spacing: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1em;
`;

const ScenarioStatus = styled.div`
  position: absolute;
  top: 55px;
  left: 160px;
  width: 450px;
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 14px;
  color: #e8e8e8;
  text-transform: uppercase;
  white-space: pre;
`;

const ScenarioButton = css`
  position: absolute;
  top: 30px;
  right: 42px;
  width: 152px;
  height: 42px;
  line-height: 42px;
  font-size: 12px;
`;

interface ScenarioProps {
  style?: any;
  scenario: ScenarioMatch;
  isDisabled: boolean;
}

interface ScenarioState {
  joinMessage: string;
  mouseOverButton: boolean;
}

export class Scenario extends React.PureComponent<ScenarioProps, ScenarioState> {
  constructor(props: ScenarioProps) {
    super(props);
    this.state = {
      joinMessage: null,
      mouseOverButton: false,
    };
  }
  public componentWillReceiveProps(newProps: ScenarioProps) {
    if (this.state.joinMessage && this.props.scenario.isQueued !== newProps.scenario.isQueued) {
      this.setState(() => ({ joinMessage: null }));
    }
  }
  public render() {
    const { scenario, isDisabled } = this.props;
    const { joinMessage } = this.state;
    let status;
    let needed;
    if (needed = scenarioIsAvailable(scenario)) {
      status = `PLAYERS NEEDED TO START NEXT GAME:\n`
        + `${needed.tdd} TDD / ${needed.viking} VKK / ${needed.arthurian} ART`;
    } else {
      status = 'Scenario Not Available';
    }

    const buttonActiveClass = !isDisabled && scenario.isInScenario ? 'active' : '';
    const buttonDisabledClass = isDisabled || joinMessage === 'Joining ...' || joinMessage === 'Leaving ...' ?
      'disabled' : '';
    return (
      <ScenarioContainer
        data-id='scenario-container'
        style={{
          backgroundImage: `linear-gradient(to right, #0000, #000 225px), url(${scenario.icon})`,
          ...this.props.style,
        }}>
        <ScenarioTitle>{scenario.name}</ScenarioTitle>
        <ScenarioStatus>{status}</ScenarioStatus>
        <Button
          className={`${ScenarioButton} ${buttonActiveClass} ${buttonDisabledClass}`}
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}>
          {this.getButtonMessage()}
        </Button>
      </ScenarioContainer>
    );
  }

  private getButtonMessage = () => {
    if (this.props.scenario.isInScenario) {
      if (this.state.mouseOverButton) {
        return 'Leave';
      } else {
        return 'Playing...';
      }
    }

    if (this.state.joinMessage) {
      return this.state.joinMessage;
    }

    if (this.props.scenario.isQueued) {
      return 'Leave Queue';
    }

    return 'Find Match';
  }

  private onClick = () => {
    if (this.props.isDisabled) {
      return;
    }

    if (this.props.scenario.isInScenario) {
      this.leaveScenario();
    }

    if (this.props.scenario.isQueued) {
      this.leaveQueue();
    } else {
      this.joinQueue();
    }
  }

  private onMouseOver = () => {
    this.setState({ mouseOverButton: true });
  }

  private onMouseLeave = () => {
    this.setState({ mouseOverButton: false });
  }

  private joinQueue = () => {
    this.setState({ joinMessage: 'Joining ...' });
    camelotunchained.game.webAPI.ScenarioAPI.AddToQueue(
      camelotunchained.game.webAPI.defaultConfig,
      this.props.scenario.id,
    );
    setTimeout(pollNow,2000);
  }

  private leaveQueue = () => {
    this.setState({ joinMessage: 'Leaving ...' });
    camelotunchained.game.webAPI.ScenarioAPI.RemoveFromQueue(
      camelotunchained.game.webAPI.defaultConfig,
      this.props.scenario.id,
    );
    setTimeout(pollNow,2000);
  }

  private leaveScenario = () => {
    camelotunchained.game.webAPI.ScenarioAPI.RemoveFromScenario(
      camelotunchained.game.webAPI.defaultConfig,
      this.props.scenario.id,
    );
    setTimeout(pollNow, 2000);
  }
}

export default Scenario;

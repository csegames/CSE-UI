/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Button } from '../Button';
import { ScenarioMatch } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { ScenarioAPI, Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { getScenarioFactionData, isScenarioMatchAvailable } from './joinScenarioUtils';
import { webConf } from '../../redux/networkConfiguration';
import { refreshScenario } from '../../dataSources/scenarioService';

const Root = 'HUD-JoinScenarioRow-Root';
const Icon = 'HUD-JoinScenarioRow-Icon';
const Content = 'HUD-JoinScenarioRow-Content';
const Name = 'HUD-JoinScenarioRow-Name';
const Description = 'HUD-JoinScenarioRow-Description';

interface ReactProps {
  match: ScenarioMatch;
}

interface InjectedProps {
  faction: Faction;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isJoining: boolean;
  isLeaving: boolean;
}

class AJoinScenarioRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isJoining: false,
      isLeaving: false
    };
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <img className={Icon} src={this.props.match.icon} />
        <div className={Content}>
          <div>
            <span className={Name}>{this.props.match.name}</span>
            <br />
            <span className={Description}>{this.getDescription()}</span>
          </div>
          <Button
            onClick={this.handleButtonClick.bind(this)}
            disabled={
              this.state.isJoining ||
              this.state.isLeaving ||
              !isScenarioMatchAvailable(this.props.match, this.props.faction)
            }
          >
            {this.getButtonText()}
          </Button>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (
      this.props.match.isInScenario !== prevProps.match.isInScenario ||
      this.props.match.isQueued !== prevProps.match.isQueued
    ) {
      this.setState({ isJoining: false, isLeaving: false });
    }
  }

  getDescription(): string {
    const factionData = getScenarioFactionData(this.props.match);
    if (!isScenarioMatchAvailable(this.props.match, this.props.faction)) {
      return 'Scenario Not Available';
    }
    return `Players Needed to Start Next Game:\n ${factionData.tdd} TDD / ${factionData.viking} VKK / ${factionData.arthurian} ART`;
  }

  getButtonText(): string {
    if (this.state.isJoining) {
      return 'Joining...';
    }
    if (this.state.isLeaving) {
      return 'Leaving...';
    }
    if (this.props.match.isInScenario || this.props.match.isQueued) {
      return 'Leave';
    }
    return 'Find Match';
  }

  async handleButtonClick(): Promise<void> {
    try {
      if (this.props.match.isQueued || this.props.match.isInScenario) {
        this.setState({ isLeaving: true });
        if (this.props.match.isInScenario) {
          await ScenarioAPI.RemoveFromScenario(webConf, this.props.match.inScenarioID);
        } else {
          await ScenarioAPI.RemoveFromQueue(webConf, this.props.match.id);
        }
      } else {
        this.setState({ isJoining: true });
        await ScenarioAPI.AddToQueue(webConf, this.props.match.id);
      }
    } catch {
      console.warn('Failed to update scenario queue.');
    }
    refreshScenario();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    faction: state.player.faction
  };
};

export const JoinScenarioRow = connect(mapStateToProps)(AJoinScenarioRow);

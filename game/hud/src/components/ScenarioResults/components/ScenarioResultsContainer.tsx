/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import ScenarioResultsView from './ScenarioResultsView';
import { CharacterOutcomeDBModel, ScenarioSummaryDBModel, ScenarioOutcome } from 'gql/interfaces';

export interface TeamInterface {
  teamID: string;
  outcome: ScenarioOutcome;
}

export interface TeamPlayer extends CharacterOutcomeDBModel {
  teamID: string;
}

export interface ScenarioResultsContainerProps {
  graphql: GraphQLResult<{ scenariosummary: ScenarioSummaryDBModel }>;
  scenarioID: string;
}

export interface ScenarioResultsContainerState {
  visible: boolean;
}

class ScenarioResultsContainer extends React.Component<ScenarioResultsContainerProps, ScenarioResultsContainerState> {
  private pollingInterval: any;

  constructor(props: ScenarioResultsContainerProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const { graphql } = this.props;
    const participantsAndTeams = this.getParticipantsAndTeams(graphql.data && graphql.data.scenariosummary);

    return (
      <ScenarioResultsView
        visible={this.state.visible}
        participants={participantsAndTeams ? participantsAndTeams.participants : []}
        teams={participantsAndTeams ? participantsAndTeams.teams : []}
        onCloseClick={this.toggleVisibility}
        status={{ loading: graphql.loading, lastError: graphql.lastError }}
        scenarioID={this.props.scenarioID}
      />
    );
  }

  public componentDidMount() {
    game.on('hudnav--navigate', (name: string) => {
      if (name === 'scenario-results') {
        this.toggleVisibility();
      }
    });
  }

  public shouldComponentUpdate(nextProps: ScenarioResultsContainerProps, nextState: ScenarioResultsContainerState) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      this.state.visible !== nextState.visible ||
      !_.isEqual(this.props.graphql, nextProps.graphql);
  }

  public componentWillUpdate(nextProps: ScenarioResultsContainerProps, nextState: ScenarioResultsContainerState) {
    const scenarioIDChanged = this.props.scenarioID !== nextProps.scenarioID;
    const visibilityChanged = this.state.visible !== nextState.visible;
    if (scenarioIDChanged || visibilityChanged) {
      this.props.graphql.refetch();
    }

    const prevTeamOutcome = this.props.graphql.data && this.props.graphql.data.scenariosummary &&
      this.props.graphql.data.scenariosummary.teamOutcomes;
    const nextTeamOutcome = nextProps.graphql.data && nextProps.graphql.data.scenariosummary &&
      nextProps.graphql.data.scenariosummary.teamOutcomes;
    if ((!prevTeamOutcome || _.isEmpty(prevTeamOutcome)) && (nextTeamOutcome && !_.isEmpty(nextTeamOutcome))) {
      if (!this.state.visible && !nextState.visible) {
        this.toggleVisibility();
      }
    }

    if (nextProps.graphql.data && nextProps.graphql.data.scenariosummary && _.isEmpty(nextTeamOutcome)) {
      if (!this.pollingInterval) {
        this.pollingInterval = setInterval(() => this.props.graphql.refetch(), 5000);
      }
    } else {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  public componentWillUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private toggleVisibility = () => {
    if (!this.state.visible) {
    } else {
      game.playGameSound(SoundEvent.PLAY_SCENARIO_END_MUSIC_CLOSEWINDOW);
    }
    this.setState({ visible: !this.state.visible });
  }

  private getParticipantsAndTeams = (scenarioSummary: ScenarioSummaryDBModel) => {
    if (scenarioSummary) {
      let participants: TeamPlayer[] = [];
      let teams: TeamInterface[] = [];
      _.forEach(scenarioSummary.teamOutcomes, (_teamOutcome) => {
        participants = participants.concat(_.map(_teamOutcome.participants, participant =>
          ({ ...participant, teamID: _teamOutcome.teamID })));
        teams = teams.concat({ teamID: _teamOutcome.teamID, outcome:  _teamOutcome.outcome });
      });

      return {
        participants,
        teams,
      };
    }
  }
}

export default ScenarioResultsContainer;

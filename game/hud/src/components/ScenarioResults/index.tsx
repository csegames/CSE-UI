/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { GraphQLQuery } from '@csegames/camelot-unchained/lib/graphql/query';
import ScenarioResultsContainer from './components/ScenarioResultsContainer';
import { ScenarioSummaryDBModel } from 'gql/interfaces';

const query = (scenarioID: string): Partial<GraphQLQuery> => ({
  namedQuery: 'scenarioSummary',
  variables: {
    scenarioID,
    shardID: game.shardID,
  },
});

export interface ScenarioResultsProps {

}

export interface ScenarioResultsState {
  scenarioID: string;
}

class ScenarioResults extends React.Component<ScenarioResultsProps, ScenarioResultsState> {
  private eventHandles: EventHandle[] = [];
  constructor(props: ScenarioResultsProps) {
    super(props);
    this.state = {
      scenarioID: '',
    };
  }

  public render() {
    const scenarioQuery = query(this.state.scenarioID);
    return (
      <GraphQL query={scenarioQuery}>
        {
          (graphql: GraphQLResult<{ scenariosummary: ScenarioSummaryDBModel }>) => {
            return <ScenarioResultsContainer scenarioID={this.state.scenarioID} graphql={graphql} />;
          }
        }
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.onScenarioRoundEnded(this.handleScenarioRoundEnded));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean) => {
    if (scenarioEnded) {
      this.setState({ scenarioID });
    }
  }
}

export default ScenarioResults;

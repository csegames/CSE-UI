/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { GraphQLQuery } from '@csegames/library/lib/_baseGame/graphql/query';
import ScenarioResultsContainer from './components/ScenarioResultsContainer';
import { ScenarioSummaryDBModel } from 'gql/interfaces';

const query = (scenarioID: string): Partial<GraphQLQuery> => ({
  namedQuery: 'scenarioSummary',
  useNamedQueryCache: true,
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
    if (this.state.scenarioID) {
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

    } else {
      let graphql : GraphQLResult<{ scenariosummary: ScenarioSummaryDBModel }> = {
        data: {
          scenariosummary: null
        },
        loading: false,
        ok: false,
        lastError: "No scenario summary to retrieve!",
        refetch: (disableLoading) => null,
        client: null
      }  
      return <ScenarioResultsContainer scenarioID={this.state.scenarioID} graphql={graphql} />;
    }
  }

  public componentDidMount() {
    this.eventHandles.push(camelotunchained.game.onScenarioRoundEnded(this.handleScenarioRoundEnded));
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

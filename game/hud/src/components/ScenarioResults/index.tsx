/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { ql, client } from 'camelot-unchained';
import { GraphQL, GraphQLResult } from 'camelot-unchained/lib/graphql/react';
import ScenarioResultsContainer from './components/ScenarioResultsContainer';

const query = (scenarioID: string) => `
  {
    scenariosummary(id: "${scenarioID}") {
      scenarioInstanceID
      shardID
      teamOutcomes {
        teamID
        outcome
        participants {
          displayName
          score
          damage {
            healingApplied {
              anyCharacter
            }
            healingReceived {
              anyCharacter
            }
            damageApplied {
              anyCharacter
            }
            damageReceived {
              anyCharacter
            }
            killCount {
              playerCharacter
              nonPlayerCharacter
            }
            deathCount {
              anyCharacter
            }
            killAssistCount {
              playerCharacter
            }
          }
        }
      }
    }
  }
`;

export interface ScenarioResultsProps {

}

export interface ScenarioResultsState {
  scenarioID: string;
}

class ScenarioResults extends React.Component<ScenarioResultsProps, ScenarioResultsState> {
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
          (graphql: GraphQLResult<{ scenariosummary: ql.schema.ScenarioSummaryDBModel }>) => {
            return <ScenarioResultsContainer scenarioID={this.state.scenarioID} graphql={graphql} />;
          }
        }
      </GraphQL>
    );
  }

  public componentDidMount() {
    client.ScenarioRoundEnded(this.handleScenarioRoundEnded);
  }

  private handleScenarioRoundEnded = (scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean) => {
    if (scenarioEnded) {
      this.setState({ scenarioID });
    }
  }
}

export default ScenarioResults;

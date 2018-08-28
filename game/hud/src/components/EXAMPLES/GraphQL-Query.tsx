/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// THIS IS ONLY AN EXAMPLE COMPONENT -- DO NOT USE ELSEWHERE!

import gql from 'graphql-tag';
import * as React from 'react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { GraphQLExampleQueryGQL } from 'gql/interfaces';

const query = gql`
  query GraphQLExampleQueryGQL($server: String!) {
    metrics(server: $server) {
      currentPlayerCount {
        arthurian
        tuatha
        viking
      }
    }
  }
`;

export interface Props {
  server: string;
}

export interface State {
}

class QueryExample extends React.Component<Props, State> {
  public render() {
    const variables: GraphQLExampleQueryGQL.Variables = {
      server: this.props.server,
    };
    return (
      <GraphQL query={{ query, variables }}>
        {
          (graphql: GraphQLResult<GraphQLExampleQueryGQL.Query>) => {

            // We have no data yet, so display something like a loading spinner or message
            if (!graphql.data) {
              return <ul>fetching...</ul>;
            }

            // Display player counts in a super awesome unordered list!
            return (
              <ul>
                <li>Arthurians: {graphql.data.metrics.currentPlayerCount.arthurian || 0}</li>
                <li>Tuatha: {graphql.data.metrics.currentPlayerCount.tuatha || 0}</li>
                <li>Vikings: {graphql.data.metrics.currentPlayerCount.viking || 0}</li>
              </ul>
            );
          }
        }
      </GraphQL>
    );
  }

  // Every React.Component class is required to define shouldComponentUpdate. Simple components can extend from a
  // PureComponent which would not require this method to be defined. The choice depends on the simplicity of
  // props & state.
  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    // The only thing we care about in this component is if the server we're querying for changed. So if it has
    // we'll re-render, otherwise not.
    return this.props.server !== nextProps.server;
  }
}

export default QueryExample;

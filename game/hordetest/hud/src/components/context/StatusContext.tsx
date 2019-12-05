/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { StatusDef } from '@csegames/library/lib/hordetest/graphql/schema';

const query = gql`
  query StatusContextQuery {
    status {
      statuses {
        id
        numericID
        name
        statusTags
        iconClass
      }
    }
  }
`;

export interface StatusContextState {
  statusDefs: {
    id: string;
    numericID: number;
    name: string;
    statusTags: string[];
    iconClass: string;
  }[];
}

const getDefaultStatusContextState = (): StatusContextState => ({
  statusDefs: [],
});

export const StatusContext = React.createContext(getDefaultStatusContextState());

export class StatusContextProvider extends React.Component<{}, StatusContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultStatusContextState();
  }

  public render() {
    return (
      <StatusContext.Provider value={this.state}>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </StatusContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<{ status: { statuses: StatusDef[] } }>) => {
    if (!graphql || !graphql.data || !graphql.data.status || !graphql.data.status.statuses) return graphql;

    this.setState({ statusDefs: graphql.data.status.statuses });
  }
}

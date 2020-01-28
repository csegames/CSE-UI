/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { User } from '@csegames/library/lib/hordetest/graphql/schema';
import { SetDisplayName } from '../fullscreen/SetDisplayName';
import { getConfig } from 'lib/gqlHelpers';
import { preloadQueryEvents } from '../fullscreen/Preloader';

const query = gql`
  query MyUserContextQuery {
    myUser {
      backerLevel
      created
      displayName
      id
      lastLogin
    }
  }
`;

export interface MyUserContextState {
  myUser: User;
  refetch: () => void;
}

export interface Props {
}

const getDefaultMyUserContextState = (): MyUserContextState => ({
  myUser: {
    backerLevel: null,
    created: null,
    displayName: null,
    id: null,
    lastLogin: null,
  },
  refetch: () => {},
});

export const MyUserContext = React.createContext(getDefaultMyUserContextState());

export class MyUserContextProvider extends React.Component<Props, MyUserContextState> {
  private isInitialQuery: boolean = true;
  constructor(props: Props) {
    super(props);

    this.state = getDefaultMyUserContextState();
  }

  public render() {
    return (
      <MyUserContext.Provider value={this.state}>
        <GraphQL query={query} useConfig={getConfig} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </MyUserContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<{ myUser: User }>) => {
    if (!graphql.data || !graphql.data.myUser) {
      // Query failed but we don't want to hold up loading. In future, handle this a little better,
      // maybe try to refetch a couple times and if not then just continue on the flow.
      this.onDonePreloading();
      return graphql;
    }

    if (!graphql.data.myUser.displayName) {
      game.trigger('show-middle-modal', <SetDisplayName onDisplayNameSet={graphql.refetch} />, false, true);
    }

    this.setState({ myUser: graphql.data.myUser, refetch: graphql.refetch });
    this.onDonePreloading();
    return graphql;
  }

  private onDonePreloading = () => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.myUserContext);
      this.isInitialQuery = false;
    }
  }
}

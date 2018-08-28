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
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import {
  GraphQLExampleSubGQLSubscription,
  GraphQLExampleSubGQLQuery,
  AlertCategory,
  TradeAlert,
} from 'gql/interfaces';

const query = gql`
  query GraphQLExampleSubGQLQuery {
    myInteractiveAlerts {
      category

      ... on TradeAlert {
        kind
        otherName
        otherEntityID
      }
    }
  }
`;

type QueryType = GraphQLExampleSubGQLQuery.Query;


const subscription = gql`
  subscription GraphQLExampleSubGQLSubscription {
    interactiveAlerts {
      category

      ... on TradeAlert {
        kind
        otherName
        otherEntityID
      }
    }
  }
`;

type SubscriptionType = GraphQLExampleSubGQLSubscription.Subscription;

export interface Props {
}

export interface State {
}

class SubscriptionExample extends React.Component<Props, State> {
  public render() {
    return (
      <GraphQL
        query={query}
        subscription={subscription}
        subscriptionHandler={this.subscriptionHandler}
      >
        {
          (graphql: GraphQLResult<QueryType>) => {

            // We have no data yet, so display something like a loading spinner or message
            if (!graphql.data || !graphql.data.myInteractiveAlerts) {
              return <ul>fetching...</ul>;
            }

            // Display alerts in a super awesome unordered list!
            return (
              <ul>
                {graphql.data.myInteractiveAlerts.map(this.renderAlert)}
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
    // this component does not update itself entirely.
    return false;
  }

  // The subscription handler processes any incoming subscription results and creates a new data object
  // that is returned to update the render function
  private subscriptionHandler = (result: SubscriptionResult<SubscriptionType>, data: QueryType): QueryType => {
    // no result, so just return the unchanged data
    if (!result.data || !result.data.interactiveAlerts) return data;

    // Safely create a copy of the incoming data array, add the new alert and return
    const myInteractiveAlerts = data && data.myInteractiveAlerts && data.myInteractiveAlerts.slice() || [];
    myInteractiveAlerts.push(result.data.interactiveAlerts);
    return {
      myInteractiveAlerts,
    };
  }

  private renderAlert = (alert: GraphQLExampleSubGQLQuery.MyInteractiveAlerts | null) => {
    switch (alert.category) {
      case AlertCategory.Trade:
        {
          const tradeAlert = alert as TradeAlert;
          return (
            <li key={tradeAlert.kind + tradeAlert.otherEntityID}>
              {tradeAlert.kind} | {tradeAlert.otherName} | {tradeAlert.otherEntityID}
            </li>
          );
        }
    }
    return null;
  }
}

export default SubscriptionExample;

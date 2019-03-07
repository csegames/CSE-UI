/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { VoxItemFragment } from '../gql/VoxItemFragment';
import { VoxStatusQuery } from 'gql/interfaces';

const query = gql`
  query VoxStatusQuery($entityId: String!) {
    entityItems(id: $entityId) {
      items {
        ...VoxItem
      }
    }
  }
  ${VoxItemFragment}
`;

export interface Props {
  voxEntityId: string;
  onQueryResult?: (graphql: GraphQLResult<VoxStatusQuery.Query>) => GraphQLResult<VoxStatusQuery.Query>;
}

class VoxStatusGQLProvider extends React.Component<Props> {
  public render() {
    return (
      <GraphQL query={{ query, variables: { entityId: this.props.voxEntityId } }} onQueryResult={this.props.onQueryResult}>
        {(graphql: GraphQLResult<VoxStatusQuery.Query>) => {
          return this.props.children ? (this.props.children as any)(graphql) : null;
        }}
      </GraphQL>
    );
  }
}

export default VoxStatusGQLProvider;

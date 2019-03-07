/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { ErrorBoundary } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { CraftingBaseQuery } from 'gql/interfaces';
import { BlockRecipesFragment } from '../gql/BlockRecipesFragment';
import { PurifyRecipesFragment } from '../gql/PurifyRecipesFragment';
import { GrindRecipesFragment } from '../gql/GrindRecipesFragment';
import { ShapeRecipesFragment } from '../gql/ShapeRecipesFragment';
import { MakeRecipesFragment } from '../gql/MakeRecipesFragment' ;
import { VoxJobGroupLogFragment } from '../gql/VoxJobGroupLogFragment';

const query = gql`
  query CraftingBaseQuery {
    crafting {
      nearestVoxEntityID
      blockRecipes {
        ...BlockRecipes
      }
      purifyRecipes {
        ...PurifyRecipes
      }
      grindRecipes {
        ...GrindRecipes
      }
      shapeRecipes {
        ...ShapeRecipes
      }
      makeRecipes {
        ...MakeRecipes
      }
      voxJobGroupLogs {
        ...VoxJobGroupLog
      }
    }
  }
  ${BlockRecipesFragment}
  ${PurifyRecipesFragment}
  ${GrindRecipesFragment}
  ${ShapeRecipesFragment}
  ${MakeRecipesFragment}
  ${VoxJobGroupLogFragment}
`;

export interface Props {
  onQueryResult?: (graphql: GraphQLResult<CraftingBaseQuery.Query>) => GraphQLResult<CraftingBaseQuery.Query>;
}

class CraftingGQLProvider extends React.Component<Props> {
  public render() {
    return (
      <ErrorBoundary renderError={error => <span>GraphQL Component Error: {error}</span>}>
        <GraphQL query={query} onQueryResult={this.props.onQueryResult}>
          {(graphql: GraphQLResult<CraftingBaseQuery.Query>) => {
            return this.props.children ? (this.props.children as any)(graphql) : null;
          }}
        </GraphQL>
      </ErrorBoundary>
    );
  }
}

export default CraftingGQLProvider;

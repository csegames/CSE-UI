/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import Header from './Header';
import MakeInfo from './MakeInfo';
import ShapeInfo from './ShapeInfo';
import BlockInfo from './BlockInfo';
import { RecipeType, RecipeData } from '../../CraftingBase';
import { Container } from 'shared/ItemTooltip';
import { ItemDefRef } from 'gql/interfaces';

export interface Props {
  recipeDef: ItemDefRef.Fragment;
  recipeData?: RecipeData;
}

class CraftingDefTooltip extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <Header recipeDef={this.props.recipeDef} type={this.getType()} />
        {this.getType() === RecipeType.Make &&
          <MakeInfo recipeData={this.props.recipeData} ingredientDefId={this.props.recipeDef.id} />
        }
        {this.getType() === RecipeType.Shape &&
          <ShapeInfo recipeDef={this.props.recipeDef} recipeData={this.props.recipeData} />
        }
        {this.getType() === RecipeType.Block &&
          <BlockInfo recipeDef={this.props.recipeDef} recipeData={this.props.recipeData} />
        }
      </Container>
    );
  }

  private getType = () => {
    return this.props.recipeData && this.props.recipeData.type;
  }
}

export default CraftingDefTooltip;

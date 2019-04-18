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
import { ItemDefRef, MakeIngredientDef, RecipeIngredientDef } from 'gql/interfaces';

export interface Props {
  recipeDef: ItemDefRef.Fragment;
  recipeData?: RecipeData;
  ingredientInfo?: MakeIngredientDef | RecipeIngredientDef;
}

class CraftingDefTooltip extends React.Component<Props> {
  public render() {
    const type = this.getType();
    const { recipeDef, recipeData, ingredientInfo } = this.props;
    return (
      <Container>
        <Header
          recipeDef={recipeDef}
          type={type}
          requirementDescription={ingredientInfo && (ingredientInfo as MakeIngredientDef).requirement}
        />
        {type === RecipeType.Make &&
          <MakeInfo
            recipeData={recipeData}
            recipeDef={recipeDef}
            ingredient={ingredientInfo as MakeIngredientDef}
          />
        }
        {type === RecipeType.Shape &&
          <ShapeInfo
            recipeDef={recipeDef}
            recipeData={recipeData}
            ingredient={ingredientInfo as RecipeIngredientDef}
          />
        }
        {type === RecipeType.Block &&
          <BlockInfo
            recipeDef={recipeDef}
            recipeData={recipeData}
            ingredient={ingredientInfo as RecipeIngredientDef}
          />
        }
      </Container>
    );
  }

  private getType = () => {
    return this.props.recipeData && this.props.recipeData.type;
  }
}

export default CraftingDefTooltip;

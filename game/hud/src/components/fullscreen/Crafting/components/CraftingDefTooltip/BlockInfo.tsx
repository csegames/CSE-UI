/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { find } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { BlockRecipeDefRef, ItemDefRef, RecipeIngredientDef } from 'gql/interfaces';
import { RecipeData } from '../../CraftingBase';

const Container = styled.div`
  padding: 10px;
`;

const InfoLine = styled.div`

`;

export interface Props {
  recipeDef: ItemDefRef.Fragment;
  recipeData: RecipeData;
  ingredient?: RecipeIngredientDef;
}

class BlockInfo extends React.Component<Props> {
  public render() {
    const ingredient = this.getIngredient();
    if (!ingredient) return null;

    return (
      <Container>
        <InfoLine>Min Unit Count: {ingredient.minUnitCount}</InfoLine>
        <InfoLine>Max Unit Count: {ingredient.maxUnitCount}</InfoLine>
        <InfoLine>Min Quality: {ingredient.minQuality * 100}</InfoLine>
        <InfoLine>Max Quality: {ingredient.maxQuality * 100}</InfoLine>
      </Container>
    );
  }

  private getIngredient = () => {
    const recipeDefRef = this.props.recipeData.def as BlockRecipeDefRef;
    return find(recipeDefRef.ingredients, ingredient => ingredient.ingredient.id === this.props.recipeDef.id);
  }
}

export default BlockInfo;

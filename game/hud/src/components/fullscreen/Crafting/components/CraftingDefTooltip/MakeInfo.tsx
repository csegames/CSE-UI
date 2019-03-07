/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { find } from 'lodash';
import { MakeRecipeDefRef } from 'gql/interfaces';
import { RecipeData } from '../../CraftingBase';

const Container = styled.div`
  padding: 10px;
`;

const InfoLine = styled.div`

`;

export interface Props {
  ingredientDefId: string;
  recipeData: RecipeData;
}

class MakeInfo extends React.Component<Props> {
  public render() {
    const ingredient = this.getIngredientInfo();
    if (!ingredient) return null;
    return (
      <Container>
        <InfoLine>Slot: {ingredient.slot}</InfoLine>
        <InfoLine>Min Quality: {ingredient.minQuality * 100}%</InfoLine>
        <InfoLine>Max Quality: {ingredient.maxQuality * 100}%</InfoLine>
        <InfoLine>Min Item Count: {ingredient.unitCount}</InfoLine>
        {ingredient.requirementDescription &&
          <InfoLine>Additional Requirements: {ingredient.requirementDescription}</InfoLine>
        }
      </Container>
    );
  }

  private getIngredientInfo = () => {
    const { recipeData, ingredientDefId } = this.props;
    if (recipeData) {
      return find((recipeData.def as MakeRecipeDefRef).ingredients,
        ingredient => ingredient.ingredient.id === ingredientDefId);
    } else {
      return null;
    }
  }
}

export default MakeInfo;

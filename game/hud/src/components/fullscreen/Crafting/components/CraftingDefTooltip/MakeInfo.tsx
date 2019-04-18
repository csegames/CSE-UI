/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { find } from 'lodash';
import { MakeRecipeDefRef, ItemDefRef, MakeIngredientDef } from 'gql/interfaces';
import { RecipeData } from '../../CraftingBase';

const Container = styled.div`
  padding: 10px;
`;

const InfoLine = styled.div`

`;

export interface Props {
  recipeDef: ItemDefRef.Fragment;
  recipeData: RecipeData;
  ingredient?: MakeIngredientDef;
}

class MakeInfo extends React.Component<Props> {
  public render() {
    const ingredient = this.props.ingredient || this.getIngredientInfo();
    if (!ingredient) return null;
    return (
      <Container>
        <InfoLine>Slot: {ingredient.slot}</InfoLine>
        <InfoLine>Min Quality: {ingredient.minQuality * 100}%</InfoLine>
        <InfoLine>Max Quality: {ingredient.maxQuality * 100}%</InfoLine>
        <InfoLine>Min Item Count: {ingredient.unitCount}</InfoLine>
      </Container>
    );
  }

  private getIngredientInfo = () => {
    const { recipeData, recipeDef } = this.props;
    if (recipeData && recipeDef) {
      return find((recipeData.def as MakeRecipeDefRef).ingredients,
        ingredient => ingredient.ingredient && ingredient.ingredient.id === recipeDef.id);
    } else {
      return null;
    }
  }
}

export default MakeInfo;

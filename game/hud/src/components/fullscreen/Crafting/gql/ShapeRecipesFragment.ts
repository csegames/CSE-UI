/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import { ItemDefRefFragment } from 'gql/fragments/ItemDefRefFragment';
import { RequirementFragment } from './RequirementFragment';

export const ShapeRecipesFragment = gql`
  fragment ShapeRecipes on ShapeRecipeDefRef {
    id
    outputItem {
      ...ItemDefRef
    }
    ingredients {
      ingredient {
        ...ItemDefRef
      }
      requirement {
        ...Requirement
      }
      minUnitCount
      maxUnitCount
      minQuality
      maxQuality
    }
  }
  ${ItemDefRefFragment}
  ${RequirementFragment}
`;

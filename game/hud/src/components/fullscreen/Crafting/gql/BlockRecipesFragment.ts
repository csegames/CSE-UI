/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import { ItemDefRefFragment } from 'gql/fragments/ItemDefRefFragment';
import { RequirementFragment } from './RequirementFragment';

export const BlockRecipesFragment = gql`
  fragment BlockRecipes on BlockRecipeDefRef {
    id
    outputItem {
      ...ItemDefRef
    }
    ingredients {
      minUnitCount
      maxUnitCount
      minQuality
      maxQuality
      ingredient {
        ...ItemDefRef
      }
      requirement {
        ...Requirement
      }
    }
  }
  ${ItemDefRefFragment}
  ${RequirementFragment}
`;

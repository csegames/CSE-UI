/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import { ItemDefRefFragment } from 'gql/fragments/ItemDefRefFragment';

export const MakeRecipesFragment = gql`
  fragment MakeRecipes on MakeRecipeDefRef {
    id
    outputItem {
      ...ItemDefRef
    }
    ingredients {
      slot
      minQuality
      maxQuality
      unitCount
      ingredient {
        ...ItemDefRef
      }
    }
  }
  ${ItemDefRefFragment}
`;

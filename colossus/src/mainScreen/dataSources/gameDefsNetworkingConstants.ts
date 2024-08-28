/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { CUQuery } from '@csegames/library/dist/hordetest/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

export type GameDefsQueryResult = Pick2<CUQuery, 'game', 'stats'>;

export const gameDefsQuery = gql`
  query GameDefsQuery {
    game {
      stats {
        addPointsAtCharacterCreation
        description
        displayType
        id
        itemRequirementStat
        name
        operation
        showAtCharacterCreation
        statType
      }
    }
  }
`;

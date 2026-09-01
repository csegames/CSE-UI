/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

export type GameDefsQueryResult = Pick2<CUQuery, 'game', 'manifests'>;
export type ManifestUpdateSubscriptionResult = Pick<CUSubscription, 'manifestUpdates'>;

export const gameDefsQuery = gql`
  query GameDefsQuery {
    game {
      manifests {
        id
        schemaVersion
        contents
      }
    }
  }
`;

export const manifestUpdateSubscription = gql`
  subscription ManifestUpdateSubscription {
    manifestUpdates {
      manifests {
        id
        schemaVersion
        contents
      }
    }
  }
`;

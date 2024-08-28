/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { CUQuery, CUSubscription } from '@csegames/library/dist/hordetest/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

// Specify the subset of keys from CUQuery that we are interested in.
export type GameSettingsQueryResult = Pick2<CUQuery, 'game', 'settings' | 'manifests'>;
export type ManifestUpdateSubscriptionResult = Pick<CUSubscription, 'manifestUpdates'>;

export const gameSettingsQuery = gql`
  query StoreStaticDataQuery {
    game {
      settings {
        dailyQuestResetsAllowed
        expensivePurchaseGemThreshold
        hardDailyQuestCount
        maxCharacterNameLength
        maxEmoteCount
        minCharacterNameLength
        normalDailyQuestCount
        startingAttributePoints
        traitsMaxPoints
        traitsMinPoints
        runeModTiers
        storeTabConfigs {
          tab
          layout
        }
      }
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

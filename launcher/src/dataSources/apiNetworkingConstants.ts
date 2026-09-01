/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { CUQuery, CUSubscription } from '../api/graphql/schema';

export type APIQueryResult = Pick<CUQuery, 'installable'>;

const installableFragment = gql`
  fragment Installable on Installable {
    accessRequirement
    apiHost
    canAccess
    canInstall
    channelID
    commandLineVersion
    isAvailable
    isOnline
    name
    productID
    productType
    group {
      name
      priority
    }
    shardID
  }
`;

export const apiQuery = gql`
  query InstallableResult {
    installable {
      ...Installable
    }
  }
  ${installableFragment}
`;

export type APISubscriptionResult = Pick<CUSubscription, 'installable'>;

export const apiSubscription = gql`
  subscription InstallableSubscription {
    installable {
      type
      ... on InstallableUpdated {
        data {
          ...Installable
        }
      }

      ... on InstallableRemoved {
        shardID
      }
    }
  }
  ${installableFragment}
`;

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type GuildQueryResult = Pick<CUQuery, 'serverTimestamp' | 'guildOfferPermissions' | 'guildOffers'>;
export type GuildOfferSubscriptionResult = Pick<CUSubscription, 'guildOffers'>;

export const guildQuery = gql`
  query Guilds {
    serverTimestamp
    guildOfferPermissions {
      allowApplications
      allowInvitations
      alwaysAllowed {
        id
        displayName
      }
      blocked {
        id
        displayName
      }
      player {
        id
        displayName
      }
      revision
    }
    guildOffers {
      player {
        id
        displayName
      }
      invitations {
        from {
          id
          displayName
        }
        to {
          id
          displayName
        }
        sent
        expires
      }
    }
  }
`;

export const guildOffersSubscription = gql`
  subscription GuildOffersSubscription {
    guildOffers {
      isInvite
      hasEnded
      from {
        id
        displayName
      }
      to {
        id
        displayName
      }
      sent
      expires
      status
      groupSize
    }
  }
`;

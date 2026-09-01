/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import gql from 'graphql-tag';

// Specify the subset of keys from CUQuery that we are interested in.
export type PartyQueryResult = Pick<CUQuery, 'serverTimestamp' | 'partyOfferPermissions' | 'partyOffers'>;
export type PartyOfferSubscriptionResult = Pick<CUSubscription, 'partyOffers'>;

export const partyQuery = gql`
  query Parties {
    serverTimestamp
    partyOfferPermissions {
      allowApplications
      allowInvitations
      alwaysAllowed {
        id
        name
      }
      blocked {
        id
        name
      }
      player {
        id
        name
      }
      revision
    }
    partyOffers {
      player {
        id
        name
      }
      invitations {
        from {
          id
          name
        }
        to {
          id
          name
        }
        sent
        expires
      }
    }
  }
`;

export const partyOffersSubscription = gql`
  subscription PartyOffersSubscription {
    partyOffers {
      isInvite
      hasEnded
      from {
        bodyTypeID
        classID
        id
        name
        raceID
      }
      to {
        bodyTypeID
        classID
        id
        name
        raceID
      }
      sent
      expires
      status
      groupSize
    }
  }
`;
